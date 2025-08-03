import LanguageSwitch from "../../components/languageSwitch/LanguageSwitch";
import Silk from "../../components/react-bits/Silk";
import AuthForm from "./AuthForm";

export default function Auth() {
  return (
    <div className="w-screen h-screen bg-accent/10 lg:bg-background relative p-2 px-4 gap-10 lg:gap-20 flex justify-center items-center">
      <div
        style={{
          maskImage: "url('/img/mask.webp')",
          WebkitMaskImage: "url('/img/mask.webp')",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
        className="flex-1 h-[85vh] absolute top-[-30%] w-full lg:static flex items-center justify-center"
      >
        <Silk
          speed={5}
          scale={1}
          color="#d24670"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      <div className=" flex-1 flex items-center justify-center">
        <AuthForm />
      </div>
      <LanguageSwitch className="fixed bottom-4 left-4" />
    </div>
  );
}
