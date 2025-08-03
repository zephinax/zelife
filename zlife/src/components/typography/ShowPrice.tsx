import React from "react";
import { numberWithCommas } from "../../utils/helper";

interface props {
  price: string | number;
  showRial?: boolean;
  className?: string;
}

const ShowPrice: React.FC<props> = ({ price, className, showRial = false }) => {
  return (
    <span
      className={`py-2 text-center px-6 rounded-lg font-medium text-base ${
        className ? className : ""
      } `}
    >
      <span dir="ltr" className=" text-secondary-700">
        {numberWithCommas(price)}
      </span>
      {showRial && (
        <span className="text-sm text-secondary-600 mr-2">ریال</span>
      )}
    </span>
  );
};

export default ShowPrice;
