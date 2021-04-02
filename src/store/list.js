import { writable } from "svelte/store";
import cryptoRandomString from "crypto-random-string";
import _find from 'lodash/find'; //lodash의 find 의 기능만 사용하겠다는 tree shaking
import _remove from 'lodash/remove';
import _cloneDeep from 'lodash/cloneDeep';

const crypto = () => {
   return cryptoRandomString({ length: 10 })
}

const repoLists = JSON.parse(window.localStorage.getItem('lists')) || []

//언더바를 사용한 이유는 명시적으로 내부에서만 사용하는 데이터
const _lists = writable(repoLists)
_lists.subscribe(($lists) => {
    //2번째 인수로 할당할 데이터 명시
    window.localStorage.setItem('lists', JSON.stringify($lists))
    //주의 :  데이터가 실제로 배열 데이터 이고 배열데이터가 로컬스토리지에 저장되려면 문자형태로 바뀌어야 한다.
})

//커스텀 스토어 subscribe: _lists.subscribe, 이것이 있으면 커스텀 스토어
export const lists = {
    //외부로 나가는 lists의 subscribe에 내부에서 쓰는 _lists의 subscribe가 된다.  참조 경계?
    subscribe: _lists.subscribe,  //자동구독

    reorder(payload){
        const { oldIndex, newIndex } = payload;
        _lists.update(($lists)=>{
            //실제 데이터의 배열의 아이템을 찾는 용도로 사용되고 그 아이템을 복사해서 / 가지고 있고 새로운 위치에 새로운 데이터를 넣는 로직
            // 1 복사 lodash
            const clone = _cloneDeep($lists[oldIndex])
            // 2 기존 index 제거
            $lists.splice(oldIndex, 1);
            // 3. 새로운 index 에 복사한 배열을 추가
            $lists.splice(newIndex, 0, clone);
            return $lists
        })
    },
    add(payload) {  //lists라는 커스텀 스토어에서 add라는 메소드를 실행하면 리스트를 추가하는 개념의 메소드
        const { title } = payload    //해당하는 리스트의 제목을 가지고 있어서 제목을 통해서 리스트를 생성...
        //payload 내부에서 title를 받아서 그것을 통해서 리스트를 생성
        _lists.update(($lists) => {
            $lists.push({
                id: crypto(),
                title: title,
                cards: []
            })
            return $lists   //push 한 것을 반환
        })
    },
    edit(payload){
        const { listId, title } = payload
        //_lists 스토어 update 반환값이 업데이트 값
        _lists.update(($lists)=>{
            //$lists 데이터에서 list.id 를 찾아서 구조분해할당으로 가져온 listId 같은지 확인한다.
            // const foundList = $lists.find((list)=>{
            //     return list.id === listId
            // })
            const foundList = _find($lists, { id: listId })  //lodash.find
            foundList.title = title;

            return $lists
        })
    },
    remove(payload) {
        const {listId} = payload;
        _lists.update(($lists) => {
            // remove
            _remove($lists, {id: listId})

            return $lists
        })
    }
}

//cards 객체데이터
export const cards = {
    reorder(payload) {
        const { fromListId, toListId, oldIndex, newIndex } = payload;
            console.log(fromListId)
        _lists.update(($lists)=>{
           const fromList = _find($lists, { id: fromListId });
           // 만약에 이동한 list 가 같으면 또 찾지 않고 from 을 할당하고 list 위치가 다르면 tolist 찾아서 tolist 변수에 담는다.
           const toList = fromListId === toListId ? fromList : _find($lists, { id: toListId });
           // fromList.cards[oldIndex] 를 복사하고
           const clone = _cloneDeep(fromList.cards[oldIndex])
            // fromList.cards를 출발하는 리스트에 cards 데이터를 삭제
            fromList.cards.splice(oldIndex, 1)
            // toList.cards 새로운 리스트에 데이터를 집어 넣는다.
            toList.cards.splice(newIndex, 0, clone)

            return $lists
        })
    },
    add(payload) {
        const { listId, title } = payload;

        _lists.update(($lists)=>{
            const foundList = _find($lists, { id: listId }) //2번째 인수 조건을 명시 : id 속성값이 listId 와 일치하는지 확인
            foundList.cards.push({
                id: crypto(),
                title: title
            })
            return $lists
        })
    },
    edit(payload){
        const { listId, cardId, title } = payload;

        _lists.update(($lists)=>{
            const foundList = _find($lists, { id: listId })
            const foundCard = _find(foundList.cards, { id: cardId })
            foundCard.title = title;

            return $lists
        })
    },
    remove(payload){
        const { listId, cardId } = payload;

        _lists.update(($lists)=>{
            const foundList = _find($lists, { id: listId });
            _remove(foundList.cards, { id: cardId })

            return $lists
        })
    }
}