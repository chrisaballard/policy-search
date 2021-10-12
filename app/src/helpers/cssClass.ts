export function removeClass(el, className) {
  console.log('remove')
  console.log(el)
  if (el?.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};

export function addClass(el, className) {
  console.log('remove')
  console.log(el)
  if (el?.classList) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
};