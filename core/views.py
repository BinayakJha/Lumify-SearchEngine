from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializer import SearchQuerySerializer
from requests_html import HTMLSession
import urllib
import requests
import json


def index(request):
    return render(request, 'index.html')


class SearchAPI(viewsets.ModelViewSet):
    queryset = Search_Query.objects.all()
    serializer_class = SearchQuerySerializer


def get_source(url):
    try:
        session = HTMLSession()
        response = session.get(url)
        return response
    except requests.exceptions.RequestException as e:
        print(e)
    

def get_results(query):
    query = urllib.parse.quote_plus(query)
    response = get_source("https://search.sapti.me/search?q=" + query + "&categories=general")
    query = query.replace(" ", "+")
    print(response)
    return response

def parse_results(response):
    css_identifier_result = "#urls article"
    css_identifier_title = "h3 a"
    css_identifier_link = "h3 a"
    css_identifier_text = "article p"
    css_identifier_cite = ".url_i1"
    # related search tab
    css_identifier_featured = ".GyAeWb"
    results = response.html.find(css_identifier_result)

    output = []
    for result in results:
        data = {}
        try:
            data['title'] = result.find(css_identifier_title, first=True).text
            data['link'] = result.find(css_identifier_link, first=True).attrs['href']
            data['favicon'] = "https://www.google.com/s2/favicons?sz=64&domain_url=" + data['link']
            data['text'] = result.find(css_identifier_text, first=True).text
            # data['text2'] = data['text'].replace("\n", "")
            # filter the links from the text
            data['text'] = data['text'].replace(data['link'], '')
            # cite functions
            data['cite'] = result.find(css_identifier_cite, first=True).text
            data['cite'] = data['cite'].replace("...", "")
            data['cite'] = data['cite'].replace("›", "")
        except:
            pass
        # close cite functions
        # youtube video image url

        if "/watch?v" in data['link']:
            link3 = data['link'].split("v=")[1]
            data['yt_url'] = f"https://i.ytimg.com/vi/{link3}/0.jpg"
        output.append(data)

    return output

def main_search(query):
    response = get_results(query)
    results = parse_results(response)
    return results

def searchjs(request,query):
    query = query
    results = main_search(query)
    return HttpResponse(json.dumps(results))

def search(request):
    return render(request, 'index.html')
# side search 

def side_search(response):
    output2 = []
    # try:
    results2 = response.html.find('#infoboxes')
    # except:
    for result2 in results2:
        data2 = {}
        try:
            data2['title'] = result2.find('.infobox h2', first=True).text
            data2['description'] = result2.find('.infobox p', first=True).text
            data2['links'] = result2.find('.url a', first=True).attrs['href']

        except:
            pass


        output2.append(data2)

    return output2

def search_1(query):
    response2 = get_results(query)
    results2 = side_search(response2)
    return results2


def main_side_search(request,query):
    query = query
    results2 = search_1(query)
    return HttpResponse(json.dumps(results2))


def suggestions(request,query):
    query = query
    response = get_source("https://search.unlocked.link/search?q=" + query)
    css_identifier_result = "#suggestions"
    results = response.html.find(css_identifier_result)
    output = []
    for result in results:
        data = {}
        sug = []
        for suggestion in result.find('.wrapper form input'):
            sugdata = {}
            sugdata['suggestions'] = suggestion.attrs['value']
            sug.append(sugdata)
        data['suggestions'] = sug

        output.append(data)
    return HttpResponse(json.dumps(output))


# image scraping

def scrape_image_google(query):
    response = get_source("https://search.unlocked.link/search?q="+ query +"&category_images=on")
    # replace whitespace with +
    query = query.replace(" ", "+")
    return response

def parse_image_results(response):
    css_identifier_result = "#urls article"
    css_identifier_title = "a"
    css_identifier_desc = "a span"
    results = response.html.find(css_identifier_result)
    # related search tab

    output = []
    for result in results:
        data = {}
        try:
            data['image_url'] = result.find(css_identifier_title, first=True).attrs['href']
            data['image_desc'] = result.find(css_identifier_desc, first=True).text
        except:
            pass
        
        output.append(data)
    # data['featured_answer'] = people_also_ask.get_simple_answer('2+2')
    return output

def main_image_search(query):
    response = scrape_image_google(query)
    results = parse_image_results(response)
    return results

def image_search(request,query):
    query = query
    results = main_image_search(query)
    return HttpResponse(json.dumps(results))