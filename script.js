/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  document.getElementById('coffee_counter').innerText=coffeeQty
}

function clickCoffee(data) {
    data.coffee ++
    updateCoffeeView(data.coffee)
    renderProducers(data)
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach(elem =>{
  if(coffeeCount>=elem.price/2) elem.unlocked=true
  })
}

function getUnlockedProducers(data) {
  let unlockedProducers =[]
  data.producers.forEach(elem =>{
  if(elem.unlocked) unlockedProducers.push(elem)})
  
  return unlockedProducers
}

function makeDisplayNameFromId(id) {
  let newStr = ''
  newStr += id[0].toUpperCase()
  for(let i=1;i<id.length;i++){
    if(id[i]==='_'){
    newStr+=' '+id[i+1].toUpperCase()}
    else if(id[i-1]==='_'){
      continue
    }
    else{
      newStr+=id[i]}
  }
  return newStr
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while(parent.firstChild){
  parent.removeChild(parent.firstChild)}
}

function renderProducers(data) {
  unlockProducers(data.producers, data.coffee)
  deleteAllChildNodes(document.getElementById('producer_container'))
  data.producers.forEach(elem =>{
    if(elem.unlocked===true)
      document.getElementById('producer_container').innerHTML+=makeProducerDiv(elem).outerHTML
  
  })
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {

  for(let i = 0; i<data.producers.length; i++){
    if(data.producers[i].id===producerId){
      return data.producers[i]
    }
  }
}

function canAffordProducer(data, producerId) {
  if(getProducerById(data, producerId).price<=data.coffee){
    return true
  }
  else{
    return false
  }
}

function updateCPSView(cps) {
  document.getElementById('cps').innerText=cps
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice*1.25)
}

function attemptToBuyProducer(data, producerId) {
  if(canAffordProducer(data,producerId)){
    getProducerById(data, producerId).qty++;
    data.coffee -= getProducerById(data, producerId).price;
    getProducerById(data, producerId).price=updatePrice(getProducerById(data, producerId).price);
    data.totalCPS += getProducerById(data, producerId).cps
    return true
  }else{
    return false
  }
}

function buyButtonClick(event, data) {
  if(event.target.id){
  let producerId = event.target.id.slice(4)
  if(canAffordProducer(data,producerId)){
  attemptToBuyProducer(data,producerId)
  renderProducers(data)
  updateCoffeeView(data.coffee)
  updateCPSView(data.totalCPS)
  }
  else{
    window.alert('Not enought coffee!')
  }
  }
}

function tick(data) {
  data.coffee+=data.totalCPS
  updateCoffeeView(data.coffee)
  renderProducers(data)
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
