import { useState, useEffect } from 'react';
import { PiTag } from "react-icons/pi";
import { TransactionTag } from '../../utils/types';

interface TagButtonProps {
 id: number;
 tag: TransactionTag | null;
 business: boolean;
 openTagModal: (id: number, business: boolean) => void;
}

const TagButton: React.FC<TagButtonProps> = ({
 id,
 tag,
 business,
 openTagModal
}) => {
 const [currentTag, setCurrentTag] = useState<TransactionTag | null>(tag);

 useEffect(() => {
   setCurrentTag(tag);
 }, [tag]);

 return (
   <button
     onClick={() => openTagModal(id, business)}
     className={`flex items-center space-x-2 px-3 py-1 hover:bg-gray-50
       ${currentTag?.name && business ? 'bg-blue-50 border rounded-md' : ''}
       ${currentTag?.name && !business ? 'bg-green-50 border rounded-md' : ''}`}
   >
     {!currentTag?.name && <PiTag size={16} className="text-gray-500 border-gray-500 bg-gray-50 p-1 w-6 h-6 border rounded-md" />}
     <span className='text-left'>{currentTag?.name || ''}</span>
   </button>
 );
};

export default TagButton;