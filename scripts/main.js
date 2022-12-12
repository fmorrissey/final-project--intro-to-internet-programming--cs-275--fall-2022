window.onload = () => 
{
    let menuShow = document.getElementById('main-menu');
    let modal = document.getElementById('modal-menu');
    let hiddenMenu = document.querySelectorAll('nav');
    let hiddenModal = document.querySelector('div');
   
menuShow.addEventListner('click, () =>
{
    if ((hiddenMenu.clasList.contain('hide')))
    {
        hiddenMenu.classListremove('hide');
    }
    else
    {
        hiddenModal.classList.add('hidden');
    }
});
document.addEventListener (`keydown`, (e) =>
{
    if (e.key === `Escape` & (!(hiddenModal.classList.contains(`hidden`)))) 
    {
        modal.click();
    }   
});

    
    
    
