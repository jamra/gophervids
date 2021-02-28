(async function() {
	let player = new Plyr('#player');

	const getList = function(vids, what) {
        var all = {};
        vids.forEach(function(v) {
            v[what].forEach(function(t) {
                all[t] = 1 + (all[t] || 0);
            });
        });
        var k = Object.keys(all).sort();
        return k.map(function(item) {
            return {
                item: item,
                count: all[item]
            };
        });
    }

	const data = await fetch('/static/vids.json');
	let vids = await data.json();
	window.vids = vids;

	vids = vids.sort((a, b) =>  a.date - b.date);
	console.log(vids);


	let tags = getList(vids, 'tags');
	let speakers = getList(vids, 'speakers');

	const domSpeakers = document.getElementById('speakers');
	const domTags = document.getElementById('tags');

	const playVideo = (title, id) => {
		// if (player) {
		// 	player.destroy();
		// }

		// player = new Plyr('#player', {
		// 	source: {
		// 		type: 'video',
		// 		sources: [
		// 			{ src: id, provider: 'youtube' }
		// 		],
		// 	}
		// });
		player.source = {
			type: 'video',
			sources: [
				{ src: id, provider: 'youtube' }
			],
		};


		console.log(player);

		player.play();
		// document.getElementById('player').dataset.plyr-embed-id = id;
		// if (player) {
		// 	player.destroy();
		// }
		
		// player = new Plyr('#player');
		// console.log('player', player);
		// player.dataset.plyr-embed-id = id;
	};

	const setHash = (type, val) => window.location.hash = type + '=' + val;

	const selectPlaylist = (vids, type, val) => {
		console.log('selectPlaylist:', vids, type, val);
		const frag = new DocumentFragment();
		const ids = [];
		for(let vid of vids) {
			if (vid[type].includes(val)) {
				ids.push({title: vid.title, id: vid.id});
				const vidInfo = document.createElement('div');
				vidInfo.innerHTML = `<div class="vid-info" data-title="${vid.title}" data-id="${vid.id}"><div class="vid__date">${vid.date}</div>${vid.title}</div>`;
				frag.appendChild(vidInfo);
			}
		}

		const pl_body = document.querySelector('.playlist__body');
		pl_body.innerHTML = '';
		pl_body.appendChild(frag);

		let vid_infos = document.querySelectorAll('.vid-info');
		for (let i = 0; i < vid_infos.length; i++) {
			vid_infos[i].addEventListener('click', (e) => {
				playVideo(e.target.dataset.title, e.target.dataset.id);
			});
		}

		playVideo(ids[0].title, ids[0].id);
	};


	const makeVidItemList = (type, dom, items) => {
		const frag = new DocumentFragment();
		for(let item of items) {
			var li = document.createElement('div')
			li.innerHTML = `<div data-type=${type} data-item="${item.item}" class="vid-item">${item.item} - ${item.count}</div>`;
			frag.appendChild(li)
		}
		dom.appendChild(frag);
	};

	makeVidItemList('speakers', domSpeakers, speakers);
	makeVidItemList('tags', domTags, tags);

	const vidItems = document.querySelectorAll('.vid-item');
	for (let i = 0; i < vidItems.length; i++) {
		vidItems[i].addEventListener('click', (e) => {
			console.log("vid list item click");
			let i = e.target.dataset;
			setHash(i.type, i.item);
			selectPlaylist(vids, i.type, i.item);
		});
	}


	const hash = window.location.hash;

	if (hash) { // user refresh or link
		const player = new Plyr('#player');
		let type, val;
		[type, val] = hash.split('=');
		type = type.substring(1);
		selectPlaylist(vids, type, val);
	}
})()
