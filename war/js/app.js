function buildFooter(active)
{
	//var menuItems = new Array;	
	var menuItems = ['home', 'notes', 'emotion', 'call'];
	var menuNames = ['Home', 'Notities', 'Emotie', 'Noodoproep'];
   
	var navbar = $('<div class="footerMenu footerMenuShadow bgWhite"></div>');

	for(var i in menuItems)
	{
		if (menuNames[i] == active)
		{
			var arrow = '<div class="footerMenuArrow"></div>';
		}
		else
		{
			var arrow = '';
		}
		
		if (menuNames[i] == 'Noodoproep')
		{
			var item = $('<div class="menuItem call bgRed"></div>');
			item.append('<a id="callButton">' + arrow + '<div class="menuIcon" id="' + menuItems[i] + '"></div><span class="footerMenuTitle">' + menuNames[i] + '</span></a>');
		}
		else
		{
			var item = $('<div class="menuItem"></div>');
			item.append('<a href="' + menuItems[i] + '.html">' + arrow + '<div class="menuIcon" id="' + menuItems[i] + '"></div><span class="footerMenuTitle">' + menuNames[i] + '</span></a>');
		}
		
			
//		var menu = menuNames[i].charAt(0).toUpperCase() + menuNames[i].slice(1);

		

		navbar.append(item);
	}
	
	$('#contentContainer').append(navbar); 
}




function buildHeader()
{
  
	var headerTop = $('<div id="headerTop" class="bgWhite"></div>');
	var headerLogo = $('<div id="headerLogo"></div>');
	
	headerLogo.append('<div class="logoIcon"><img src="/images/logoIcon.png" height="36" width="36"></div>');
	headerLogo.append('<div class="logoText">Time out!</div>');
	headerTop.append(headerLogo);

	var toggleMenu = $('<div id="toggleMenu" class="notActive"></div>');
	headerTop.append(toggleMenu);
	
	var headerMenu = $('<div id="headerMenu" class="displayNone"></div>');
	
	var menuUl = $('<ul></ul>');
	
	menuUl.append('<li><a href="javascript:location.reload(true)">Home</a></li>');
	menuUl.append('<li><a href="javascript:location.reload(true)">Refresh</a></li>');
	menuUl.append('<li><a href="">Settings</a></li>');
	menuUl.append('<li><a href="">Help</a></li>');
	menuUl.append('<li><a href="login.html" class="noBorder">Logout</a></li>');
	
	headerMenu.append(menuUl);

	
	$('#header').append(headerTop, headerMenu); 
}





