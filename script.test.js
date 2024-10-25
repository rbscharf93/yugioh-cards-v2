
// TO DO: Add permissions functionality

/*
  Change these values as needed
*/
const TWITCH_BROADCASTER = "aSpookyBlumpkin";
const GLOBAL_COOLDOWN_DURATION = 0; // in seconds 
const USER_COOLDOWN_DURATION = 0; // in seconds
const ANIMATION_DURATION = 8.03; // in seconds
const RANDOM_COMMAND = 'randomcard';

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
const mainAudio = document.getElementById('main-audio');

let globalCooldown;
let userCooldownsList = [];
let globalClock;
let i = 0;

const addGlobalCooldown = () => {
  globalCooldown = setTimeout(() => {
    globalCooldown = null;
    logTime();
    console.log('Global cooldown removed');
  }, GLOBAL_COOLDOWN_DURATION*1000);
};

const addUserCooldown = (user) => {
  const userCooldown = setTimeout((user) => {
    console.log('\n')
    logTime();
  	let userRemoved = userCooldownsList.pop();
    console.log(`${userRemoved.username} removed from user cooldowns...`);
  }, USER_COOLDOWN_DURATION*1000);
  const newUserCooldown = {username: user, cooldown: userCooldown};
  userCooldownsList.unshift(newUserCooldown);
};

const playSound = () => {
  mainAudio.muted = false;
  mainAudio.play().catch((err) => {
    console.log(err);
  });
};

const showCard = (card, user) => {
  addGlobalCooldown();
  addUserCooldown(user);
  mainImg.src = card.url;
  mainImg.classList.remove('hidden');
  setTimeout(() => {
    mainImg.src = '';
    mainImg.classList.add('hidden');
  }, ANIMATION_DURATION*1000);
  playSound();
};

const logTime = () => {
  console.log(`${Math.floor(i / 60)}:${(i % 60) < 10 ? '0' : ''}${i % 60}`)
};

ComfyJS.onCommand = ( user, command ) => {
  const trimmedText = command.trim();
  console.log('\n');
  logTime();
  console.log(`${user} used ${command}`);
  if (trimmedText === RANDOM_COMMAND) {
    const ranNum = Math.floor(Math.random() * cardsList.length);
    const card = cardsList[ranNum];
    showCard(card, user);
    return;
  };
  const card = cardsList.find((element) => {
    return element.cmd === trimmedText;
  });
  if (!card) {
    console.log('No card found :(');
    return;
  }
  const isUserCooldown = userCooldownsList.find((element) => {
    return element.username === user;
  });
  
  if (globalCooldown) {
    console.log('Global cooldown active');
    return;
  };
  if (isUserCooldown) {
    console.log(`${isUserCooldown.username} is on user cooldown`);
    return;
  }
  showCard(card, user);
  console.log(`${card.cmd} has been played...`);
  console.log('Global cooldown:');
  console.log(`${globalCooldown ? 'True' : 'False'}`);
  console.log('User cooldowns:');
  console.log(userCooldownsList);
};

document.addEventListener('DOMContentLoaded', () => {
  globalClock = setInterval(() => {
    if (i >= 3600) {
      i = 0;
    } else {
      i++;
    }
    if (i % 60 === 0) {
      logTime();
    }
  }, 1000);
});

ComfyJS.Init( TWITCH_BROADCASTER );
