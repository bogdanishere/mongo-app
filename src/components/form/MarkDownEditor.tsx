import dynamic from "next/dynamic";
import { Form } from "react-bootstrap";
import {
  FieldError,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import ReactMarkdown from "react-markdown";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

interface MarkDownEditorProps {
  register: UseFormRegisterReturn;
  label?: string;
  error?: FieldError;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  editorHeight?: number;
}

export default function MarkDownEditor({
  register,
  label,
  error,
  watch,
  setValue,
  editorHeight = 500,
}: MarkDownEditorProps) {
  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label htmlFor={register.name + "-input_md"}>{label}</Form.Label>
      )}
      <MdEditor
        {...register}
        id={register.name + "-input"}
        value={watch(register.name)}
        renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
        onChange={({ text }) =>
          setValue(register.name, text, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        placeholder="Write something..."
        className={error ? "is-invalid" : ""}
        style={{ height: editorHeight }}
      />
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
