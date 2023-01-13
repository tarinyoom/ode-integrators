import { Tooltip } from "@mui/material";

function RefIcon({href, src, name}: {href: string, src: string, name: string}
	) {
	return <Tooltip title={name} placement="top">
			<a href={href} target="_blank" rel="noopener noreferrer">
				<img width={"24px"} height={"24px"} src={src}></img>
		 	</a>
		   </Tooltip>

}

export default RefIcon;
