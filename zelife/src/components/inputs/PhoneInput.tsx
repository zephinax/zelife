import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import Label from "../typography/Label";
import { RiCloseCircleLine } from "react-icons/ri";
import Paragraph from "../typography/Paragraph";

export default function PhoneInput({
  phoneNumber,
  onChange,
  label,
  errorText,
}: {
  phoneNumber: { phone: string }[];
  onChange: (phoneNumbers: { phone: string }[]) => void;
  label?: string;
  errorText: string;
}) {
  const [phoneNumberList, setPhoneNumberList] = useState<{ phone: string }[]>(
    phoneNumber || []
  );

  // Validation function
  const isPhoneNumberValid = (phone: string): boolean => {
    return (
      /^\d{11}$/.test(phone) &&
      (phone.startsWith("0") || phone.startsWith("09"))
    );
  };

  const handleNew = () => {
    if (
      phoneNumberList.length === 0 ||
      phoneNumberList[phoneNumberList.length - 1]?.phone?.length === 11
    ) {
      setPhoneNumberList([...phoneNumberList, { phone: "" }]);
    }
  };

  const handleEdit = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newList = [...phoneNumberList];
      newList[index].phone = value;
      setPhoneNumberList(newList);
      onChange(newList);
    }
  };

  const handleDelete = (index: number) => {
    const newList = phoneNumberList.filter((_, i) => i !== index);
    setPhoneNumberList(newList);
    onChange(newList);
  };

  useEffect(() => {
    if (phoneNumber) {
      setPhoneNumberList(phoneNumber);
    }
  }, [phoneNumber]);

  return (
    <div className="flex flex-col gap-2">
      {label && <Label text={label} />}
      <div className="flex items-center gap-2 flex-wrap border-1 rounded-lg px-1 py-1">
        <div className="flex items-center gap-2 flex-wrap">
          {phoneNumberList.map((item, index) => (
            <div
              key={index}
              className={`bg-secondary-200 px-2 inline-flex hover:gap-1 rounded-3xl py-1 border ${
                item.phone && !isPhoneNumberValid(item.phone)
                  ? "border-red-500"
                  : "border-secondary-200"
              } group relative`} // Added 'group' and 'relative' for hover effect
            >
              <input
                onChange={(e) => handleEdit(index, e.target.value)}
                className="appearance-none mr-0.5 border-none bg-transparent shadow-none focus:outline-none w-[14ch] text-center"
                type="text"
                value={item.phone}
                maxLength={11}
              />
              <button
                onClick={() => handleDelete(index)}
                className=" left-0 bg-red-500 text-white rounded-full transition-all h-0 mt-2.5 flex items-center justify-center w-0 group-hover:mt-0.5 group-hover:h-5 group-hover:w-5 opacity-100 duration-200"
              >
                <RiCloseCircleLine size={24} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={handleNew} className="flex gap-2 items-center">
          <span className="w-[30px] h-[30px] text-[20px] flex items-center justify-center border hover:bg-yellow-50 transition-all duration-150 border-primary rounded-[50%] text-primary">
            <GoPlus />
          </span>
          <Paragraph theme="primary">افزودن شماره</Paragraph>
        </button>
      </div>
      {errorText && <p className="text-red-500 text-sm">{errorText}</p>}
    </div>
  );
}
