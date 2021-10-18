import { addClass, removeClass } from '../helpers/cssClass';

const useListSelect = (elementId: string, listLength: number) => {
  let liSelected;
  let index = -1;
  
  const navigateList = (e): void => {
    const ul = document.getElementById(elementId)
    const len = listLength - 1;
    if(e.key === 'ArrowDown') {
      index += 1;
      // down
      if(liSelected) {
        removeClass(liSelected, 'selected');
        let next = ul.getElementsByTagName('li')[index];
        if (typeof next !== undefined && index <= len) {
          liSelected = next;
        }
        else {
          index = 0;
          liSelected = ul.getElementsByTagName('li')[0]

        }
        addClass(liSelected, 'selected');
      }
      else {
        index = 0;
        liSelected = ul.getElementsByTagName('li')[0];
        addClass(liSelected, 'selected');
      }
    }
    else if (e.key === 'ArrowUp') {
      // up
      if(liSelected) {
        removeClass(liSelected, 'selected');
        index -= 1;
        let next = ul.getElementsByTagName('li')[index];
        if (typeof next !== undefined && index >= 0) {
          liSelected = next;
        }
        else {
          index = len;
          liSelected = ul.getElementsByTagName('li')[len];
        }
        addClass(liSelected, 'selected');
      }
      else {
        index = 0;
        liSelected = ul.getElementsByTagName('li')[len];
        addClass(liSelected, 'selected');
      }
    }
    else if (e.key === 'Enter') {
      if(liSelected) {
        liSelected.children[0].click()
        window.removeEventListener('keydown', navigateList);
      }
    }
  }

  const clearSelected = () => {
    const listItems = document.querySelectorAll(`#${elementId} li`);
    listItems.forEach((el) => {
      el?.classList.remove('selected')
    })
  }

  return [ navigateList, clearSelected ] as const;
}

export default useListSelect;

