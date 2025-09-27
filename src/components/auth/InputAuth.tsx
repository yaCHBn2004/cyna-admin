
import { useTranslation } from "react-i18next";

const InputAuth = ({ label, name, type = 'text', value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <label htmlFor={name} className="block mb-2 text-sm text-[#444444]">
        {t(label)}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={t(`${label}.placeholder`, `Enter your ${label.toLowerCase()}`)}
        className="w-full px-3 h-13 border border-[#444444] rounded-[4px] text-xs focus:outline-none focus:ring-2 focus:bg-zinc-100 focus:border-0"
      />
    </div>
  );
};

export default InputAuth;
