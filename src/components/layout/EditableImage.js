import Image from "next/image";
import toast from "react-hot-toast";

export default function EditableImage({link, setLink}) {
  async function handleFileChange(ev) {
    const files = ev.target.files;
    if (files?.length === 1) {
      const data = new FormData;
      data.set('file', files[0]);
      const uploadPromise = fetch('/api/upload', {
        method: 'POST',
        body: data,
      }).then(response => {
        if (response.ok) {
          return response.json().then(link => {
            setLink(link.url);
          })
        }
        throw new Error('Something went wrong');
      });
      await toast.promise(uploadPromise, {
        loading: 'Uploading...',
        success: 'Upload complete',
        error: 'Upload error',
      });
    }
  }

  return (
    <div className="flex flex-col items-center">
      {link && (
        <div style={{ width: '250px', height: '250px', position: 'relative' }}>
          <Image
            className="rounded-lg"
            src={link}
            fill
            style={{objectFit:"cover"}}
            alt="Item image"
          />
        </div>
      )}
      {!link && (
        <div className="text-center bg-gray-200 p-4 text-gray-500 rounded-lg mb-1 w-[250px] h-[250px] flex items-center justify-center">
          No image
        </div>
      )}
      <label className="button">
        <input type="file" className="hidden" onChange={handleFileChange} />
        Change image
      </label>
    </div>
  );
}