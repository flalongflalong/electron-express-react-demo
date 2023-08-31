import React, { useState } from 'react';

const Hype = () => {
	let [name, setName] = useState('hypeName');

	return (
		<div className="container hypeContainer">
			<div id={`${name}_hype_container`} class="hype-main need-resize">
				{name}
				<script type="text/javascript" charset="utf-8" src={`./res/HYPE/${name}.hyperesources/${name}_hype_generated_script.js`}></script>
			</div>
		</div>
	);
};

export default Hype;
