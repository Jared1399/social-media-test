localStorage.setItem('sidebar','hidden');

function toggleSidebar () {

    if(localStorage.getItem('sidebar') === 'hidden'){
        document.getElementById("sidebar").style.display = "block";
        document.getElementById("side__button_close").style.display = "block";
        document.getElementById("side__button_open").style.display = "none";
        localStorage.setItem('sidebar','visible');
    } else {
        document.getElementById('sidebar').style.display = "none";
        document.getElementById("side__button_close").style.display = "none";
        document.getElementById("side__button_open").style.display = "block";
        localStorage.setItem('sidebar','hidden');
    }
    
}