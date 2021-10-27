"""Use this script to convert a flat policy concept keyword csv file to yaml format.

The file must contain the following columns:

- level0 - first level of concept hierarchy
- level1 - second level of concept hierarchy
- keyword - keyword assigned to each level

The file should be normalised with one row per lower level and unique keyword. This means that if there
are multiple keywords assigned to a level, it should be flattened to contain one row for each keyword.

For example:

level0      level1      keyword
adaptation  adaptation  adaptation
adaptation  adaptation  agricultural productivity
adaptation  adaptation  coastal erosion
...         ...         ...

Note that this script supports at most two hierarchy levels.
"""

from pathlib import Path

import pandas as pd
from pandas.core import indexing
import yaml



def get_unique_keywords(
    level_keywords: pd.Series
):
    """Return a list of unique keywords for a provided concept hierarchy level
    """

    keywords = level_keywords.unique().tolist()
    keywords = [
        k.lower().strip() 
        for k in keywords
        if not pd.isna(k)
    ]

    return keywords

def get_level(
    df: pd.DataFrame,
    level_prefix: str,
    level_id: int
):
    """Return the level name, and eith"""
    level_name = f'{level_prefix}{level_id}'
    next_level_name = f'{level_prefix}{level_id + 1}'

    for level_ix, (level_name, level_df) in enumerate(df.groupby(level_name)):
        level = {'id': level_ix, 'name': level_name}
        print(level_name)

        if next_level_name not in level_df:
            keywords = get_unique_keywords(level_df.keywords)
            level['keywords'] = keywords
        else:
            level['levels'] = list(get_level(level_df, 'level', level_id + 1))

        yield level

def convert_concept_csv_to_yaml(
    concept_csv_path: Path
):
    """Read a concept hierarchy csv file and return a yaml representation
    """

    if concept_csv_path.exists():
        concept_df = pd.read_csv(concept_csv_path)
    else:
        raise FileNotFoundError('File does not exist')

    levels = []
    # Iterate over levels in concept hierarchy
    for level in get_level(concept_df, 'level', 0):
        levels.append(level)    

    return levels

def main(data_path: Path):
    sectors_filename = data_path / 'sectors.csv'
    sectors_yml_filename = data_path / f'{sectors_filename.stem}.yml'
    instruments_filename = data_path / 'instruments.csv'
    instruments_yml_filename = data_path / f'{instruments_filename.stem}.yml'
    
    # Get dictionary for sectors
    sectors = convert_concept_csv_to_yaml(sectors_filename)
    # Save sectors to yaml
    with open(sectors_yml_filename, 'wt') as yml_f:
        yaml.dump(sectors, yml_f, indent=2, sort_keys=False)

    # Get dictionary for instruments
    instruments = convert_concept_csv_to_yaml(instruments_filename)
    # Save instruments to yaml
    with open(instruments_yml_filename, 'wt') as yml_f:
        yaml.dump(instruments, yml_f, indent=2, sort_keys=False)


if __name__ == '__main__':
    main(Path('./schema/'))