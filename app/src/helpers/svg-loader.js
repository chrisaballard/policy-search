export function setUpLoader() {
	const mainColor = '#666';
	const xmlns = "http://www.w3.org/2000/svg";
	const radius = [
		// (window.innerHeight * .58) / 2,
		// (window.innerHeight * .72) / 2,
		// (window.innerHeight * .93) / 2
		
		(200 * .58) / 2,
		(200 * .72) / 2,
		(200 * .93) / 2
	];

	const svg = document.querySelector('#radar');

	const wrapper = document.createElementNS(xmlns, 'g');
	// wrapper.setAttributeNS(null, 'transform', "translate("+window.innerWidth /2+" "+window.innerHeight /2+")");
	wrapper.setAttributeNS(null, 'transform', "translate(150 150)");



	const lineGroup_1 = document.createElementNS(xmlns, 'g');
	lineGroup_1.setAttribute('class', 'line-1');
	const lineGroup_2 = document.createElementNS(xmlns, 'g');
	lineGroup_2.setAttribute('class', 'line-2');
	const lineGroup_3 = document.createElementNS(xmlns, 'g');
	lineGroup_3.setAttribute('class', 'line-3');

	const pointRadar_1 = createPointRadar(radius[0]);
	const pointRadar_2 = createPointRadar(radius[1]);
	const pointRadar_3 = createPointRadar(radius[2]);
	lineGroup_1.appendChild(pointRadar_1);
	lineGroup_2.appendChild(pointRadar_2);
	lineGroup_3.appendChild(pointRadar_3);

	createBulletRadar(lineGroup_1, radius[0], false);
	createBulletRadar(lineGroup_2, radius[1], true);
	createBulletRadar(lineGroup_3, radius[2], false);

	wrapper.appendChild(lineGroup_1);
	wrapper.appendChild(lineGroup_2);
	wrapper.appendChild(lineGroup_3);

	svg.appendChild(wrapper);

	document.querySelector('.line-2').style.transform = "rotate(100deg, "+window.innerWidth /2+", "+window.innerHeight /2+")"

	function createPointRadar(radius){
		const obj = document.createElementNS(xmlns, 'circle');
		obj.setAttributeNS(null, 'r', radius);
		obj.setAttributeNS(null, 'cx', 0);
		obj.setAttributeNS(null, 'cy', 0);
		obj.setAttributeNS(null, 'fill', "none");
		obj.setAttributeNS(null, 'stroke', mainColor);
		obj.setAttributeNS(null, 'stroke-width', "1");
		obj.setAttributeNS(null, 'stroke-opacity', ".2");

		return obj;
	}

	function createBulletRadar(group, radius, half){
		if(half){
			const bullet = document.createElementNS(xmlns, 'circle');
			bullet.setAttribute('class', 'bullet-opacity-1');
			bullet.setAttributeNS(null, 'r', (Math.random()*3) + 2);
			bullet.setAttributeNS(null, 'cx', 0);
			bullet.setAttributeNS(null, 'cy', 0 - radius);
			bullet.setAttributeNS(null, 'fill', mainColor);
			group.appendChild(bullet);
		}
		
		const bullet2 = document.createElementNS(xmlns, 'circle');
		bullet2.setAttribute('class', 'bullet-opacity-2');
		bullet2.setAttributeNS(null, 'r', (Math.random()*3) + 2);
		bullet2.setAttributeNS(null, 'cx', 0 - radius);
		bullet2.setAttributeNS(null, 'cy', 0);
		bullet2.setAttributeNS(null, 'fill', mainColor);
		group.appendChild(bullet2);
		

	if(half){
		const bullet3 = document.createElementNS(xmlns, 'circle');
		bullet3.setAttribute('class', 'bullet-opacity-3');
		bullet3.setAttributeNS(null, 'r', (Math.random()*3) + 2);
		bullet3.setAttributeNS(null, 'cx', 0);
		bullet3.setAttributeNS(null, 'cy', 0 + radius);
		bullet3.setAttributeNS(null, 'fill', mainColor);
		group.appendChild(bullet3);
	}
		
		const bullet4 = document.createElementNS(xmlns, 'circle');
		bullet4.setAttribute('class', 'bullet-opacity-4');
		bullet4.setAttributeNS(null, 'r', (Math.random()*3) + 2);
		bullet4.setAttributeNS(null, 'cx', 0 + radius);
		bullet4.setAttributeNS(null, 'cy', 0);
		bullet4.setAttributeNS(null, 'fill', mainColor);
		group.appendChild(bullet4);
	}

	function createAvatar(){

		const flareSize = 150;
		
		document.querySelector('.f-anim1').style.width = flareSize + "px";
		document.querySelector('.f-anim1').style.height = flareSize + "px";
		document.querySelector('.f-anim3').style.width = flareSize + "px";
		document.querySelector('.f-anim3').style.height = flareSize + "px";
	}
	createAvatar();
}