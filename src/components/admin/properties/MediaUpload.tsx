
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MediaUploadProps {
  type: "images" | "videos";
  files: FileList | null;
  onFilesChange: (files: FileList | null) => void;
  existingFiles?: string[];
  property?: { id?: string };
}

const MediaUpload = ({ type, files, onFilesChange, existingFiles, property }: MediaUploadProps) => {
  const isImages = type === "images";
  const label = isImages ? "Images" : "Vidéos";
  const accept = isImages ? "image/*" : "video/*";

  return (
    <div>
      <Label htmlFor={type}>
        {label} {property && "(laissez vide pour conserver les fichiers existants)"}
      </Label>
      <Input
        id={type}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => onFilesChange(e.target.files)}
      />
      {property && existingFiles && existingFiles.length > 0 && (
        <div className="mt-2">
          {isImages ? (
            <div className="flex gap-2 overflow-x-auto">
              {existingFiles.map((file, index) => (
                <img
                  key={index}
                  src={file}
                  alt={`${label} ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          ) : (
            <div>{existingFiles.length} vidéo(s) existante(s)</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
