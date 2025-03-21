// YourComponent.tsx

import { devenvfolder } from "@/shared/dosettings";
import spaces from "@/utility/digitalOceanSpace";
import { Image } from "antd";
import React, { useEffect, useState } from "react";

interface props {
  filename: string;
  folder: string;
  width: any;
  height: number;
  key?: number;
  style?: React.CSSProperties;
}

const DOImageViewer = ({
  filename,
  folder,
  width,
  height,
  key,
  style,
}: props) => {
  const [imageURL, setImageURL] = useState<string>("");

  useEffect(() => {
    const getImage = async () => {
      try {
        const params: AWS.S3.GetObjectRequest = {
          Bucket: "megatam", // Replace 'your-bucket-name' with your Space bucket name
          Key: `${devenvfolder}/${folder}/${filename}`, // Replace with the path to your image in the Space
          // Key: 'DEVELOPMENT/ATTENDANCE_CAPTURE/DVTRADE_EMPATT_PRJ_office_based_IN_2024-01-03T111938394Z.jpg', // Replace with the path to your image in the Space
        };

        const signedUrl: string = await spaces.getSignedUrlPromise(
          "getObject",
          params
        );
        setImageURL(signedUrl);
      } catch (error) {
        console.error("Error fetching image from DigitalOcean Spaces:", error);
      }
    };

    getImage();
  }, []);

  return (
    <div key={key}>
      {imageURL && (
        // <img
        //   width={width}
        //   height={height}
        //   src={imageURL + '&w=200&quality=50'}
        //   alt='DigitalOcean Spaces Image'
        //   style={style??{}}
        // />
        <Image
          width={width}
          height={height}
          src={imageURL + "&w=200&quality=50"}
          style={style ?? {}}
        />
      )}
    </div>
  );
};

export default DOImageViewer;
