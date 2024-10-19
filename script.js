
// TO DO: Add permissions functionality

/*
  Change these values as needed
*/
const TWITCH_BROADCASTER = "aSpookyBlumpkin";
const GLOBAL_COOLDOWN_DURATION = 10; // in seconds 
const USER_COOLDOWN_DURATION = 30; // in seconds
const ANIMATION_DURATION = 8.03; // in seconds

const cardsList =
  /*
  	To add more cards, copy and paste the first line below (with the curly braces and comma), then 
    replace the vaules inside the quotes "" with the new command name and file path.
  */
[
  {cmd: "lordspooky", url: "./imgs/LordSpooky_1.gif"},
  {cmd: "plateofmidchicken", url: "./imgs/PlateOfMidChicken.gif"},
  {cmd: "overlordtrama", url: "./imgs/Overlord Trama.gif"}
];

const mainImg = document.getElementById('main-image');

let globalCooldown;
let userCooldownsList = [];

const addGlobalCooldown = () => {
  globalCooldown = setTimeout(() => {
    globalCooldown = null;
  }, GLOBAL_COOLDOWN_DURATION*1000);
};

const addUserCooldown = (user) => {
  const userCooldown = setTimeout((user) => {
  	userCooldownsList.pop();
  }, USER_COOLDOWN_DURATION*1000);
  const newUserCooldown = {username: user, cooldown: userCooldown};
  userCooldownsList.unshift(newUserCooldown);
};

const showCard = (card) => {
  mainImg.src = card.url;
  mainImg.classList.remove('hidden');
  setTimeout(() => {
    mainImg.src = '';
    mainImg.classList.add('hidden');
  }, ANIMATION_DURATION*1000);
};

ComfyJS.onCommand = ( user, command ) => {
  const trimmedText = command.trim();
  const card = cardsList.find((element) => {
    return element.cmd === trimmedText;
  });
  if (!card) {
    return;
  }
  const isUserCooldown = userCooldownsList.find((element) => {
    return element.username === user;
  });
  
  if (globalCooldown || isUserCooldown) {
    return;
  }
  addGlobalCooldown();
  addUserCooldown(user);
  showCard(card);
};

ComfyJS.Init( TWITCH_BROADCASTER );
