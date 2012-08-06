function buildFooter(active)
{
	//var menuItems = new Array;	
	var menuItems = ['home', 'notes', 'emotion', 'call'];
	var menuNames = ['Home', 'Notities', 'Emotie', 'Noodoproep'];
   
	var navbar = $('<div class="footerMenu footerMenuShadow bgWhite"></div>');

	for(var i in menuItems)
	{
		/*
		if (active == menuItems[i])
		{	
			highlighter = '<li class="active">'; else highlighter = '<li>';
		}
		*/
		
		if (menuNames[i] == active)
		{
			var arrow = '<div class="footerMenuArrow"></div>';
		}
		else
		{
			var arrow = '';
		}
		
		var item = $('<div class="menuItem"></div>');
			
//		var menu = menuNames[i].charAt(0).toUpperCase() + menuNames[i].slice(1);

		item.append('<a href="' + menuItems[i] + '.html">' + arrow + '<div class="menuIcon" id="' + menuItems[i] + '"></div><span class="footerMenuTitle">' + menuNames[i] + '</span></a>');

		navbar.append(item);
	}
	
	$('#contentContainer').append(navbar); 
}




/*
<div class="footerMenu footerMenuShadow bgWhite">
	
	<div class="menuItem">
	<a href="index.html" data-role="button">
		<div class="footerMenuArrow"></div>
		<div class="menuIcon" id="home"></div>
		<span class="footerMenuTitle">Home</span>
	</a></div>
	
	<div class="menuItem">
	
		<a href="notes.html"><div class="menuIcon" id="notes"></div><span class="footerMenuTitle">Notitie</span></a>
		
	</div>
	
	<div class="menuItem">
	<a href="emotion.html" data-role="button">
		<div class="menuIcon" id="emotion"></div>
		<span class="footerMenuTitle">Emotie</span>
	</a></div>
	
	<div class="menuItem call bgRed">
	<a href="call.html" data-role="button">
		<div class="menuIcon" id="call"></div>
		<span class="footerMenuTitle">Noodoproep</span>
	</a></div>
	
</div>
*/