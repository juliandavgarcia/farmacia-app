import { toast } from "sonner";
import { VscError } from "react-icons/vsc";
import { FaCircleCheck } from "react-icons/fa6";
import { FiInfo } from "react-icons/fi";

interface ToastProps {
  tipo: "success" | "error" | "info";
  texto: string;
  descripcion: string;
}

const GeneradorAlerta = ({ tipo: type, texto: text, descripcion: description }: ToastProps) => {
  const icon = {
    error: <VscError />,
    success: <FaCircleCheck />,
    info: <FiInfo />,
  }[type];

  toast[type](text, {
    description,
    duration: 3000,
    icon,
    cancel: {
      label: "Cerrar",
      onClick: () => {},
    },
  });
};

export default GeneradorAlerta;
