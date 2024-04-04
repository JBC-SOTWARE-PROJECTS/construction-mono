let envfolder: string = "";

if (process.env.NODE_ENV === "development") {
  envfolder = "DEVELOPMENT";
}else{
  envfolder = "PRODUCTION";
}

export let devenvfolder = envfolder;
