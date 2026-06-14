// Curated domain lists that power the built-in lenses. Patterns are matched by
// suffix, so "edu" matches "cs.stanford.edu" and "arxiv.org" matches
// "export.arxiv.org". Kept deliberately small and opinionated — users can fork
// any built-in lens and tweak these to taste.

/** Universities, journals, and primary research sources. */
export const ACADEMIC = [
  "edu", "ac.uk", "gov", "arxiv.org", "nih.gov", "ncbi.nlm.nih.gov",
  "nature.com", "science.org", "jstor.org", "acm.org", "ieee.org",
  "springer.com", "sciencedirect.com", "plos.org", "pnas.org",
  "semanticscholar.org", "researchgate.net", "scholar.google.com",
];

/** SEO-bait, content farms, and walled/low-signal Q&A. */
export const SLOP = [
  "pinterest.com", "quora.com", "answers.com", "ehow.com", "wikihow.com",
  "coursehero.com", "chegg.com", "scribd.com", "slideshare.net",
  "byjus.com", "toppr.com", "studocu.com",
];

/** The big commercial / social platforms the "small web" lens pushes down. */
export const BIG_WEB = [
  "google.com", "youtube.com", "facebook.com", "instagram.com", "twitter.com",
  "x.com", "tiktok.com", "amazon.com", "reddit.com", "linkedin.com",
  "pinterest.com", "quora.com", "medium.com", "microsoft.com", "apple.com",
  "netflix.com", "ebay.com", "walmart.com", "yelp.com", "substack.com",
];

/** Official documentation sources. */
export const DOCS = [
  "developer.mozilla.org", "docs.python.org", "readthedocs.io",
  "docs.djangoproject.com", "react.dev", "reactjs.org", "nextjs.org",
  "nodejs.org", "rust-lang.org", "go.dev", "kubernetes.io",
  "docs.github.com", "learn.microsoft.com", "developer.apple.com",
  "developer.android.com", "docs.aws.amazon.com", "pkg.go.dev",
];

/** Tutorial-spam sites the "docs only" lens pushes down. */
export const TUTORIAL_SPAM = [
  "w3schools.com", "geeksforgeeks.org", "tutorialspoint.com",
  "javatpoint.com", "programiz.com", "guru99.com", "educba.com",
];
