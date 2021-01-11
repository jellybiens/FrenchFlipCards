
export var disableSwipe = false;

export const destroyCard = (dir, swiped) => {

  //is animation still running? if so, ignore action
  if (disableSwipe) return false;

    disableSwipe = true;
    //get top card
    const topCard = document.querySelector('.card:last-child');
    //subit corresponding form
    const form = dir ? topCard.querySelector('.submitPos') : topCard.querySelector('.submitNeg');
    form.dispatchEvent(new Event('submit'));
    //add swipe off css animation class
    const swipeOffClass = dir ? "swipeRight" : "swipeLeft" ;
    if(!swiped) topCard.classList.add(swipeOffClass);
    else topCard.classList.add(swipeOffClass + "Fin");

    setTimeout(() => {
      //destroy card
      topCard.remove();
      disableSwipe = false;


    }, 600);


    const endOfStack = document.querySelector('.cards_deck').childElementCount === 6;
    //return if stack is empty
    return endOfStack;
}
