import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react';

import { useSousTraitants } from '../../context/SousTraitantsContext';
import { fetchCommercialRegisterFileInfo } from '../../services/client';

export default function SousTraitantDetails() {
  const { id } = useParams();
  const [sousTraitant, setSousTraitant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileInfo, setFileInfo] = useState(null);
   const [showPreview, setShowPreview] = useState(false);
  const { getUserById } = useSousTraitants();

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      const user = getUserById(Number(id));
      setSousTraitant(user);

      try {
        const fileData = await fetchCommercialRegisterFileInfo(id);
        setFileInfo(fileData);
      } catch (error) {
        console.error('Failed to fetch file info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, getUserById]);

  const handleDownload = async () => {
    if (!fileInfo?.file_url) return;

    try {
      const response = await fetch(fileInfo.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileInfo.filename || `registre_commerce_${sousTraitant.first_name}_${sousTraitant.last_name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleView = () => {
    if (fileInfo?.file_url) {
      window.open(fileInfo.file_url, '_blank');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!sousTraitant) return <div className="p-4">Sous traitant not found.</div>;

  return (
    <div className="p-4 h-full w-full flex flex-col gap-10 mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-textMain">
        <Link to="/client/sous-traitants" className="hover:underline text-primary">Sous Traitant</Link>
        <span className="mx-1">/</span>
        <span className="font-semibold">Details #{sousTraitant.id}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-bold">Sous Traitant</h1>
        <span className="text-gray-500 text-sm">
          Registered: {new Date(sousTraitant.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Info sections */}
      <section>
        <h2 className="text-[22px] font-bold mb-4">Sous Traitant Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 text-sm">
          <InfoRow label="First Name" value={sousTraitant.first_name} />
          <InfoRow label="Last Name" value={sousTraitant.last_name} />
          <InfoRow label="Phone Number" value={sousTraitant.phone_number} />
          <InfoRow label="Email" value={sousTraitant.email} />
        </div>
      </section>

      <section>
        <h2 className="text-[22px] font-bold mb-4">Professional Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 text-sm">
          <InfoRow label="Business Name" value={sousTraitant.company_name} />
          <InfoRow label="NIF" value={sousTraitant.nif} />
          <InfoRow label="NIS" value={sousTraitant.nis} />
          <InfoRow label="Business Address" value={sousTraitant.address} />
        </div>
      </section>

      {/* PDF Section */}
 {fileInfo && (
  <section>
    <h2 className="text-[22px] font-bold mb-4">Uploaded Document</h2>

    {/* File Info + Actions */}
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded border border-gray-200">
      <div
        className="flex items-center gap-2 text-primary underline cursor-pointer"
        onClick={handleDownload}
      >
        <FileText size={18} />
        <span>{fileInfo.filename || 'Registre Commerce'}</span>
      </div>
      <div className="flex items-center gap-2">
        {showPreview ? (
          <EyeOff
            size={18}
            className="text-primary cursor-pointer"
            onClick={() => setShowPreview(false)}
          />
        ) : (
          <Eye
            size={18}
            className="text-primary cursor-pointer"
            onClick={() => setShowPreview(true)}
          />
        )}
        <Download
          size={18}
          className="text-primary cursor-pointer"
          onClick={handleDownload}
        />
      </div>
    </div>

    {/* Embedded PDF Preview */}
    {showPreview && fileInfo.file_url && (
      <div className="mt-4 border rounded shadow h-[600px] overflow-hidden">
        <iframe
          src={fileInfo.file_url}
          width="100%"
          height="100%"
          title="PDF Preview"
        ></iframe>
      </div>
    )}
  </section>
)}



      {/* Status */}
      <section>
        <h2 className="text-[22px] font-bold mb-4">Status</h2>
        <div className="relative inline-block text-left">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-full text-sm font-medium text-yellow-800 bg-yellow-100">
            {sousTraitant.approval_status || 'Pending'}
            <ChevronDown className="ml-2 w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Back link */}
      <div>
        <Link to="/client/sous-traitants" className="text-primary hover:underline text-sm">
          ← Back to list
        </Link>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col border-t border-gray-100 py-4">
      <span className="text-primary text-[14px]">{label}</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
}
