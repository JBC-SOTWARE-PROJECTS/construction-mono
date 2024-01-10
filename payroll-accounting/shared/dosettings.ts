let envfolder: string = "";

if (process.env.NODE_ENV === "development") {
  envfolder = "DEVELOPMENT";
}else{
  envfolder = "STAGING";
}

export let devenvfolder = envfolder;
