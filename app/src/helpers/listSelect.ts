import { addClass, removeClass } from './cssClass';

export const listSelect = (id: string) => {
  const ul = document.getElementById(id)
  const listItems = document.querySelectorAll(`#${id} li`);
  let liSelected;
  let index = -1;

  const navigateList = (e): void => {
    const len = listItems.length - 1;
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
      console.log('enter key hit')
      if(liSelected) {
        liSelected.children[0].click()
        window.removeEventListener('keydown', navigateList);
      }
    }
  }
  
  window.addEventListener('keydown', navigateList, false);
}

