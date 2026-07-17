import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return {
 name:"Mustapha Samady Literary Archive", short_name:"Mustapha Samady",
 description:"Official digital literary archive of Mustapha Samady.",
 start_url:"/", scope:"/", display:"standalone", background_color:"#f5f0e8", theme_color:"#171513", lang:"fa", dir:"rtl",
 icons:[{src:"/icon-192.png",sizes:"192x192",type:"image/png"},{src:"/icon-512.png",sizes:"512x512",type:"image/png"}],
}; }
