function openLogin(){
document.getElementById('loginModal').style.display='flex';
}

const CURRENT_USER_KEY = 'sweatify-current-user';
const USER_PROFILES_KEY = 'sweatify-user-profiles';

function calculateBmiValue(heightCm, weightKg){
if(!heightCm || !weightKg){
return null;
}

const bmi = weightKg / Math.pow(heightCm / 100, 2);
if(!Number.isFinite(bmi) || bmi <= 0){
return null;
}

return bmi.toFixed(1);
}

function getPokemonAvatar(seedText){
const seed = (seedText || 'sweatify').toLowerCase();
let hash = 0;

for(let i = 0; i < seed.length; i += 1){
hash = (hash + seed.charCodeAt(i) * (i + 1)) % 151;
}

const pokemonId = hash + 1;
return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemonId + '.png';
}

function getUserProfiles(){
const raw = localStorage.getItem(USER_PROFILES_KEY);
if(!raw){
return {};
}

try{
const parsed = JSON.parse(raw);
return parsed && typeof parsed === 'object' ? parsed : {};
}catch(error){
return {};
}
}

function saveUserProfiles(profiles){
localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(profiles));
}

function saveCurrentUser(user){
localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function getCurrentUser(){
const raw = localStorage.getItem(CURRENT_USER_KEY);
if(!raw){
return null;
}

try{
const parsed = JSON.parse(raw);
return parsed && typeof parsed === 'object' ? parsed : null;
}catch(error){
return null;
}
}

function renderAuthState(){
const authButtons = document.getElementById('auth-buttons');
const userProfile = document.getElementById('user-profile');
const userAvatar = document.getElementById('user-avatar');
const userPopup = document.getElementById('user-popup');
const popupAvatar = document.getElementById('popup-avatar');
const popupName = document.getElementById('popup-name');
const popupEmail = document.getElementById('popup-email');
const popupBmi = document.getElementById('popup-bmi');
const popupPlan = document.getElementById('popup-plan');
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const authTabs = document.querySelectorAll('.auth-tab');
const welcomeMessage = document.getElementById('community-welcome-message');
const communityLeft = document.querySelector('.community-left');

const currentUser = getCurrentUser();
if(!currentUser){
if(authButtons){
authButtons.classList.remove('hidden');
}

if(userProfile){
userProfile.classList.add('hidden');
}

if(signupForm){
signupForm.style.display = '';
signupForm.classList.add('active');
}

if(loginForm){
loginForm.style.display = '';
loginForm.classList.remove('active');
}

if(authTabs.length >= 2){
authTabs[0].style.display = '';
authTabs[0].classList.add('active');
authTabs[1].style.display = '';
authTabs[1].classList.remove('active');
}

if(welcomeMessage){
welcomeMessage.classList.add('hidden');
}

if(userPopup){
userPopup.classList.add('hidden');
}

if(communityLeft){
communityLeft.style.display = '';
}

const communityLayout = document.querySelector('.community-layout');
if(communityLayout){
communityLayout.classList.remove('logged-in');
}

return;
}

if(authButtons){
authButtons.classList.add('hidden');
}

if(userProfile){
userProfile.classList.remove('hidden');
}

if(signupForm){
signupForm.classList.remove('active');
signupForm.style.display = 'none';
}

if(loginForm){
loginForm.classList.remove('active');
loginForm.style.display = 'none';
}

if(authTabs.length >= 2){
authTabs[0].style.display = 'none';
authTabs[1].style.display = 'none';
authTabs[1].classList.remove('active');
}

if(welcomeMessage){
welcomeMessage.classList.remove('hidden');
}

if(communityLeft){
communityLeft.style.display = 'none';
}

const communityLayout = document.querySelector('.community-layout');
if(communityLayout){
communityLayout.classList.add('logged-in');
}

if(!userAvatar || !popupAvatar || !popupName || !popupEmail || !popupBmi || !popupPlan){
return;
}

const avatarSrc = currentUser.avatar || getPokemonAvatar(currentUser.email || currentUser.name || 'sweatify');
userAvatar.src = avatarSrc;
popupAvatar.src = avatarSrc;
popupName.textContent = currentUser.name || 'Sweatify User';
popupEmail.textContent = 'Email: ' + (currentUser.email || 'No email');
popupBmi.textContent = 'BMI: ' + (currentUser.bmi || 'Not set');
popupPlan.textContent = 'Plan: ' + (currentUser.plan || 'Not selected');
}

function setUserSession(profile){
saveCurrentUser(profile);
renderAuthState();
}

function logoutUser(){
localStorage.removeItem(CURRENT_USER_KEY);
renderAuthState();

const userPopup = document.getElementById('user-popup');
if(userPopup){
userPopup.classList.add('hidden');
}

const authButtons = document.getElementById('auth-buttons');
const userProfile = document.getElementById('user-profile');
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const authTabs = document.querySelectorAll('.auth-tab');

if(authButtons){
authButtons.classList.remove('hidden');
}

if(userProfile){
userProfile.classList.add('hidden');
}

if(signupForm){
signupForm.style.display = '';
signupForm.classList.add('active');
}

if(loginForm){
loginForm.style.display = '';
loginForm.classList.remove('active');
}

if(authTabs.length >= 2){
authTabs[0].style.display = '';
authTabs[0].classList.add('active');
authTabs[1].style.display = '';
authTabs[1].classList.remove('active');
}

const messageEl = document.getElementById('community-auth-message');
if(messageEl){
messageEl.textContent = 'Logged out successfully.';
messageEl.classList.remove('error');
messageEl.classList.add('success');
}
}

function choosePlan(planName){
const currentUser = getCurrentUser();
const messageEl = document.getElementById('community-auth-message');

if(!currentUser){
if(messageEl){
messageEl.textContent = 'Please login first to select a plan.';
messageEl.classList.remove('success');
messageEl.classList.add('error');
}
return;
}

currentUser.plan = planName;
const profiles = getUserProfiles();
profiles[(currentUser.email || '').toLowerCase()] = currentUser;
saveUserProfiles(profiles);
setUserSession(currentUser);

if(messageEl){
messageEl.textContent = 'Plan updated to ' + planName + '.';
messageEl.classList.remove('error');
messageEl.classList.add('success');
}
}

function closeLogin(){
document.getElementById('loginModal').style.display='none';
}

function openSignup(){
document.getElementById('signupModal').style.display='flex';
}

function closeSignup(){
document.getElementById('signupModal').style.display='none';
}

function openServicePage(url, event){
if(event){
event.preventDefault();
}

const currentUser = getCurrentUser();
const contactSection = document.getElementById('contact');
const messageEl = document.getElementById('community-auth-message');

if(!currentUser){
if(messageEl){
messageEl.textContent = 'Please join or login to access this service.';
messageEl.classList.remove('success');
messageEl.classList.add('error');
}

if(contactSection){
contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

return false;
}

window.location.href = url;
return true;
}

function openExercisePage(url, event){
if(event){
event.preventDefault();
}

const currentUser = getCurrentUser();
const contactSection = document.getElementById('contact');
const messageEl = document.getElementById('community-auth-message');

if(!currentUser){
if(messageEl){
messageEl.textContent = 'Please join or login to access this workout page.';
messageEl.classList.remove('success');
messageEl.classList.add('error');
}

if(contactSection){
contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

return false;
}

window.location.href = url;
return true;
}

function openUserPopup(){
const userPopup = document.getElementById('user-popup');
if(userPopup){
userPopup.classList.remove('hidden');
}
}

function closeUserPopup(){
const userPopup = document.getElementById('user-popup');
if(userPopup){
userPopup.classList.add('hidden');
}
}

function showCommunityForm(type){
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const tabs = document.querySelectorAll('.auth-tab');

if(!signupForm || !loginForm || tabs.length === 0){
return;
}

tabs.forEach((tab) => tab.classList.remove('active'));

if(type === 'login'){
signupForm.classList.remove('active');
loginForm.classList.add('active');
tabs[1].classList.add('active');
}else{
loginForm.classList.remove('active');
signupForm.classList.add('active');
tabs[0].classList.add('active');
}
}

async function submitCommunityAuth(endpoint, payload){
const messageEl = document.getElementById('community-auth-message');

try{
const response = await fetch(endpoint, {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(payload)
});

const result = await response.json();

if(!response.ok || !result.success){
throw new Error(result.message || 'Request failed');
}

if(messageEl){
messageEl.textContent = result.message;
messageEl.classList.remove('error');
messageEl.classList.add('success');
}

return result;
}catch(error){
if(messageEl){
messageEl.textContent = error.message;
messageEl.classList.remove('success');
messageEl.classList.add('error');
}

return null;
}
}

document.addEventListener('DOMContentLoaded', () => {
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

renderAuthState();

if(signupForm){
signupForm.addEventListener('submit', async (event) => {
event.preventDefault();

const name = document.getElementById('signup-name').value.trim();
const email = document.getElementById('signup-email').value.trim();
const password = document.getElementById('signup-password').value;

console.log({ name, email, password }); // DEBUG

const payload = {
name: name,
email: email,
password: password
};

// ✅ FULL URL (important fix)
const result = await submitCommunityAuth('http://localhost/fitness/api/signup.php', payload);
if(!result){
return;
}

const plan = document.getElementById('signup-plan').value;
const height = Number(document.getElementById('signup-height').value);
const weight = Number(document.getElementById('signup-weight').value);
const bmi = calculateBmiValue(height, weight);

const profile = {
name: name,
email: email,
plan: plan,
bmi: bmi || 'Not set',
avatar: getPokemonAvatar(email)
};

const profiles = getUserProfiles();
profiles[email.toLowerCase()] = profile;
saveUserProfiles(profiles);
setUserSession(profile);
});
}

if(loginForm){
loginForm.addEventListener('submit', async (event) => {
event.preventDefault();
const email = document.getElementById('login-email').value.trim();
const password = document.getElementById('login-password').value;

const payload = {
email: email,
password: password
};

const result = await submitCommunityAuth('api/login.php', payload);
if(!result){
return;
}

const profiles = getUserProfiles();
const storedProfile = profiles[email.toLowerCase()];
let nameFromMessage = email.split('@')[0];

if(result.message && result.message.includes('Welcome back,')){
nameFromMessage = result.message.replace('Login successful. Welcome back,', '').replace('!', '').trim() || nameFromMessage;
}

const profile = storedProfile || {
name: nameFromMessage,
email: email,
plan: 'Not selected',
bmi: 'Not set',
avatar: getPokemonAvatar(email)
};

profiles[email.toLowerCase()] = profile;
saveUserProfiles(profiles);
setUserSession(profile);
});
}
});