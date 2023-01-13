function RefIcon({href, src}: {href: string, src: string}
	) {
	return <a href={href} target="_blank" rel="noopener noreferrer">
			<img width={"24px"} height={"24px"} src={src}></img>
		   </a>
}

export default RefIcon;
