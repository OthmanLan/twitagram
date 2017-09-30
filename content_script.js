let style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('style.css');
(document.head||document.documentElement).appendChild(style);

function loadIG(elem) {
  const container_link = elem.querySelector(".js-tweet-text-container");
  const displayed_url = container_link.querySelectorAll(".twitter-timeline-link");
  let insta_url = null;

  for (let i = 0, c = displayed_url.length; i < c; i++) {
    if (displayed_url[i].innerText && displayed_url[i].innerText.indexOf('instagram.com') !== -1) {
      insta_url = displayed_url[i];
    }
  }
    
  if (insta_url) {

   // retrieve ig link
   const ig = insta_url.getAttribute('data-expanded-url');

    // get img src from ig api
    fetch(`https://api.instagram.com/oembed/?url=${ig}`).then(function(res) {
      return res.json();
    }).then(function(json) {
      const image = json.thumbnail_url;
      const description = json.title;
      const image_url = image.slice(0, image.indexOf('s612x612')) + image.slice(image.indexOf('s612x612') + 9);
      const future_container = `<div class='igviewer'><p>${description}</p><a href=${ig} target='_blank'><img src=${image_url} alt='ig-card'/></a></div>`
      container_link.insertAdjacentHTML('afterend', future_container)
    }).catch(function(err) {
      console.log(err);
    })
  }
};

// // select the target node
var target = document.getElementById('stream-items-id');
var initial_posts = target.querySelectorAll(".js-stream-item");

//find batch of initial cards
for (let i = 0; i < initial_posts.length; i++) {
  loadIG(initial_posts[i]);
}

// observe mutations on subsequent cards
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var posts = mutation.addedNodes
    
    for (let i = 0; i < posts.length; i++) {
      loadIG(posts[i]);
    }
  });
});

var config = { attributes: false, childList: true, characterData: false, subtree: false };

observer.observe(target, config);