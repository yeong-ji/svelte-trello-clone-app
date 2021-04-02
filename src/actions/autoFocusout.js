export function autoFocusout(elem, focusoutListener ){
    const focusinListener = function (event) {
        // edit mode 영역
        event.stopPropagation() //이벤트 버블링 방지
    }


   setTimeout(()=> {
       elem.addEventListener('click', focusinListener)
       window.addEventListener('click', focusoutListener)
   },0)

    return {
        destroy() {
           elem.removeEventListener('click', focusinListener)
            window.removeEventListener('click',focusoutListener)
        }
    }
}
