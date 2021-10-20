
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../store/initialState';

const useSuggestList = (list: any[], type: string) => {
  const [ suggestList, setSuggestList ] = useState([])
  const state = useSelector((state: State ) => state)
  const { filters } = state;

  const isDuplicate = (name) => {
    return filters[`${type}Filters`].some(item => item.name === name);
  }
  const suggest = (input: string): void => {
    if (!input.length) {
      setSuggestList([]);
      return;
    }
    const filteredList = list.filter((item) => {
      return item.name.toLowerCase().indexOf(input.toLowerCase()) > -1 && !isDuplicate(item.name);
    })
    setSuggestList(filteredList.slice(0, 10))
  }
  return [suggestList, suggest] as const;
}
export default useSuggestList;