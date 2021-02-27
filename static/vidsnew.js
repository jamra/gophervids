(async function() {
	const player = new Plyr('#player');

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
	vids = vids.sort(function(a, b) {
			return (a.date == b.date ? 0 : (a.date < b.date ? 1 : -1));
	});


	console.log('vids:', vids);
	let tags = getList(vids, 'tags');
	console.log('tags:', tags);
	let speakers = getList(vids, 'speakers');
	console.log('speakers:', speakers);

	new Choices(document.getElementById('speakers'), {items: speakers});
	new Choices(document.getElementById('tags'), {items: tags});

})()




