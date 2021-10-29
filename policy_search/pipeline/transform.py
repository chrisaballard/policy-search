"""Defines transformation functions that can operate on attributes
"""

def delimited_string_to_list(value: str, **kwargs):
        """Transforms an attribute value given as a delimited string to a list type"""

        delim = kwargs.get("delim", ";")

        return [a.strip() for a in value.split(delim)]