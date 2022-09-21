/* Setting theme and language during page loading */
window.addEventListener('load', () => {
    if(getCookie('theme') == 'dark'){
        document.getElementById('theme').setAttribute('href', './css/theme/dark.css')
        changeBtnTheme(document.querySelector('.btn #lgt-theme-icon').parentElement);
    }
    else{
        document.getElementById('theme').setAttribute('href', './css/theme/light.css');
        changeBtnTheme(document.querySelector('.btn #drk-theme-icon').parentElement);
    }

    lang = getCookie('lang');
    document.querySelectorAll('.lang ul li').forEach(e => {
        if(e.getAttribute('value') == getCookie('lang')){
            removeSelection(document.querySelectorAll('.lang ul li'));
            e.classList.add('selected');
        }
    })

    if(window.location.pathname == '/index.html'){
        changeChartTheme(document.getElementById('theme').getAttribute('href') === './css/theme/light.css' ? 'light' : 'dark');
        changeLangApp(getCookie('lang'));
    }
})

/* Using of hamburger icon */
const menuBtn = document.querySelector(".hamburger");
const rightPart = document.querySelector("header .right");
let open = false;

menuBtn.addEventListener("click", () => {
    if(!open){
        menuBtn.classList.add("open");
        rightPart.classList.add("show-right");
        open = true;
    } else{
        menuBtn.classList.remove("open");
        rightPart.classList.remove("show-right");
        open = false;
    }
});



/* Changing theme of the page */
const themeBtns = document.querySelectorAll('.right .btn-slider .btn');
const theme = document.getElementById('theme');
const selectedDivTheme = document.querySelector('.right .btn-slider .selected-btn');
    
themeBtns.forEach((e, i) => {
    e.addEventListener('click', () => {
        if(!e.classList.contains('selected')){
            theme.setAttribute('href', theme.getAttribute('href') === './css/theme/light.css' ? './css/theme/dark.css' : './css/theme/light.css');
        
            changeBtnTheme(e)

            if(window.location.pathname == '/index.html'){
                changeChartTheme(theme.getAttribute('href') === './css/theme/light.css' ? 'light' : 'dark');
            }
            
            setCookie('theme', theme.getAttribute('href') === './css/theme/light.css' ? 'light' : 'dark', 30);
        }
    });
})

function changeBtnTheme(e){
    selectedDivTheme.style.left = theme.getAttribute('href') === './css/theme/light.css' ? '0' : '50%';
        
    removeSelection(themeBtns);
    e.classList.add('selected');

    themeBtns[0].classList.remove('dark');
    themeBtns[1].classList.remove('light');
    theme.getAttribute('href') === './css/theme/light.css' ? e.classList.add('light') : e.classList.add('dark');
}

/* Function that change the current language when it is clicked and call the changeLang function */
const languages = document.querySelectorAll('.lang ul li');
languages.forEach(e => {
    e.addEventListener('click', () => {
        if(!e.classList.contains('selected')){
            lang = e.getAttribute('value');
            if(window.location.pathname == '/index.html'){
                changeLangApp(lang);
            }
            else{
                changeLangLand(lang);
            }

            removeSelection(document.querySelectorAll('.lang ul li'));
            e.classList.add('selected');

            setCookie('lang', lang, 30);

            if(window.location.pathname == '/index.html'){
                if((searchBar.value.trim() != "" && searchBar.value.trim() != null) || (lat != 0 && long != 0))
                    initializationPage()
            }
        }
    })
})

function removeSelection(el){
    el.forEach(e => {
        for (let i = 0; i < 3; i++) {
            e.classList.remove('selected');
        }
    });
}

