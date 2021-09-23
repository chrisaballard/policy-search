"""Processing of extractive qa search results
"""
from typing import List
import itertools
from operator import itemgetter


def format_policy_search_results(
    search_prediction: dict,
):
    answers = search_prediction['answers']
    policy_id = lambda a: a['meta']['source_policy_id']
    # sort answers in order of returned documents
    answers = sorted(answers, key=policy_id)
    # group answers by document
    grouped_answers = itertools.groupby(answers, key=policy_id)
    grouped_answers = dict((g_k, list(g_a)) for g_k, g_a in grouped_answers)

    formatted_answers = []
    for policy_id, g_a in grouped_answers.items():
        policy_answers = []
        for answer in g_a:
            meta_policy_name = answer['meta']['name']
            policy_answers.append(
                {
                    'answer': answer['answer'],
                    'probability': answer['probability'],
                    'score': answer['score']
                }
            )

        formatted_answers.append(
            {
                'source_policy_id': policy_id,
                'policy_name': meta_policy_name,
                'answers': policy_answers
            }
        )

    return formatted_answers

def pretty_print_answers(
    formatted_answers: List[dict],
):
    """Formatted print of search result answers
    """

    for policy_answers in formatted_answers:
        policy_id = policy_answers['source_policy_id']
        policy_name = policy_answers['policy_name']
        
        print(f'{policy_name} ({policy_id}):')
        
        for answer in policy_answers['answers']:
            answer_result = answer['answer'].replace('\n', '')
            answer_prob = answer['probability']
            print(f'  - {answer_result} ({answer_prob: 0.1%})')
        
        print('\n')
