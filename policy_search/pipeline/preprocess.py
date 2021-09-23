import re


def clean_text(text):
    """
    Cleans a string of raw text, e.g. scraped from policy document or a 
    summary description of a target from CCLW meta-data.
    Cleaning process involves:
        - removing HTML tags, 
        - strip URLS
        - removing commas from numbers
        - reforming words broken over lines with hyphens
        - remove non-ascii chars
        - removing tabs with whitespace
        - replacing semicolons (";") with fullstops (".")
        - replacing repeated punctuation with first instance "...?" -> ".?"
        - replacing repeated spaces with a single space

    Parameters
    ----------
    text : string
        - input text to be cleaned

    Returns
    -------
    string
        - Cleaned version of input text
    """

    # remove HTML tags
    cleanr = re.compile('<.*?>')
    text = re.sub(cleanr, '', text)
    
    # sort out HMTL formatting of &
    text = re.sub(r"&", r"and", text)
    
    # remove HTML nonbreaking space - after & replacement
    text = re.sub(r"andnbsp;", "", text)
    
    # strip any urls
    text = re.sub(r"http[s]{0,1}://[^\s]*", r"", text)
    
    # remove commas in numbers (else spaCy tokenizer will split on them)
    text = re.sub(r",([0-9])", "\\1", text)

    # reform words broken over lines (e.g. mist- ake -> mistake)
    text = re.sub(r"(\d)(\s*-\s*)(\d)", r"\1-\3", text) 
    text = re.sub(r"([a-zA-Z]+)(\s-)", r"\1", text) 
    text = re.sub(r"([a-zA-Z]+)(-\s)", r"\1", text) 

    # remove non-ascii characters
    text = re.sub(r'[^\x00-\x7f]',r'',text) 

    #replace tab characters with single whitespace
    text = re.sub(r"\t", " ", text)
    
    #replace semicolons with fullstop - useful to break up long or bulletted lists
    text = re.sub(r";", ".", text)
    
    # replace repeated non word chars with first instance
    text = re.sub(r"([/\W+/g])\1+", r"\1",text)
    
    # replace repeated spaces with single space
    text = re.sub('\s{2,}', " ", text)
    
    return text