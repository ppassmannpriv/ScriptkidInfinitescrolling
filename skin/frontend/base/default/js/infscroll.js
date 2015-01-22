if(jQuery('body').hasClass('catalog-category-view'))
{
	jQuery.urlParam = function(name, url){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
		if (results==null){
			return null;
		}
		else{
			return results[1] || 0;
		}
	}

	jQuery('.toolbar-bottom').prepend('<p class="loadingnote">Weitere Produkte werden geladen.</p>');
	jQuery('.pager').hide();

	var next = jQuery('.pager:last a.next').attr('href');
	var end = false;
	var init = true;

	function getNextpage()
	{
		jQuery('.loadingnote').stop(true,false).fadeIn(750);

		var req = jQuery.ajax({
			url: next,
			dataType: 'json',
		});
		
		return req;
	}

	function addContent(req)
	{
		var contentObject = jQuery.parseHTML(req.responseJSON.listing);
		contentObject = contentObject[0].children['products-list'];
		
		if(contentObject.children.length < 12){	end = true;	}

		contentObject = jQuery(contentObject.children).addClass('animate');

		jQuery('.category-products ol.products-list').append(contentObject);

		jQuery('.category-products').ready(function(){
			jQuery('.products-list:not(:first)').addClass('added-list');
			jQuery('.products-list:last li.item:last-child').addClass('last added');
			jQuery('.products-list li.animate').fadeIn(1500);
			
		});

		jQuery('.loadingnote').hide();

		return true;
	}

	function execute()
	{
		var req = getNextpage();
		req.done(function(){
			addContent(req);
			if(addContent)
			{
				var loaded = jQuery.urlParam('p', next);
				next = next.replace('p=' + loaded, 'p=' + (parseInt(loaded) + 1));
			}
		});
	}

	jQuery(window).scroll(function(){
		if(!end)
		{
			if(jQuery('.products-list:last li.item.last.added:in-viewport').length > 0)
			{
				jQuery('.products-list li.item.last').removeClass('last');
				execute();
			} else if(jQuery('.products-list li.last:in-viewport').length > 0 && init)
			{
				init = false; 
				execute();
			}
		} else {
			if(jQuery('.endnote').length == 0)
			{
				jQuery('.toolbar-bottom').prepend('<p class="endnote">Keine weiteren Produkte gefunden.</p>');
			}
		}
	});		
}