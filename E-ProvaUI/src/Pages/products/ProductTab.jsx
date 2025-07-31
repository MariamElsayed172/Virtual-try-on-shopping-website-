import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTemperatureLow } from "react-icons/fa6";
import { MdDoNotDisturb } from "react-icons/md";
import { GiWashingMachine } from "react-icons/gi";
import { FcDoNotInsert } from "react-icons/fc";
import { FcDoNotMix } from "react-icons/fc";


export default function ProductTab() {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'delivery', label: 'Delivery policy' },
    { id: 'shipping', label: 'Shipping & Return' },
    { id: 'custom', label: 'Custom tab' }
  ];

  const tabContent = {
    description: {
      title: 'Product Description',
      content: (
        <>
          <p className="mb-4">
            Captivate with this shirt&apos;s versatile urban look that works as well at happy hour as it does in the back yard. 
            The real mother of pearl buttons and embroidered crocodile complete its elegant appeal.
          </p>
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Care Instructions:</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 flex items-center justify-center border rounded">
                  <GiWashingMachine className="text-xl" />
                </span>
                MACHINE WASH AT MAX.TEMP. 30° C - NORMAL PROCESS
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 flex items-center justify-center border rounded">
                  <FcDoNotInsert className="text-xl" />
                </span>
                DO NOT BLEACH
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 flex items-center justify-center border rounded">
                  <FcDoNotMix className="text-xl" />
                </span>
                DO NOT TUMBLE DRY
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 flex items-center justify-center border rounded">
                  <FaTemperatureLow className="text-xl" />
                </span>
                IRON AT MAX. TEMP. OF 110° C WITHOUT STEAM
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 flex items-center justify-center border rounded">
                  <MdDoNotDisturb className="text-xl" />
                </span>
                DO NOT DRY CLEAN
              </li>
            </ul>
          </div>
        </>
      )
    },
    delivery: {
      title: 'Delivery Policy',
      content: (
        <div className="space-y-4">
          <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">Standard Delivery</h3>
              <p className="text-sm text-gray-600">2-4 Business Days</p>
            </div>
            <p className="font-medium">Free</p>
          </div>
          <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">Express Delivery</h3>
              <p className="text-sm text-gray-600">1-2 Business Days</p>
            </div>
            <p className="font-medium">$14.99</p>
          </div>
        </div>
      )
    },
    shipping: {
      title: 'Shipping & Return Policy',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Shipping Information</h3>
            <p className="text-gray-600">
              We ship to over 100 countries worldwide through our partnership with multiple carriers.
              Shipping costs and delivery times vary depending on location, size, and weight of the items.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Return Policy</h3>
            <p className="text-gray-600">
              We accept returns within 30 days of delivery. Items must be unused, unworn, and in the original packaging.
              Return shipping costs are the responsibility of the customer unless the item is defective.
            </p>
          </div>
        </div>
      )
    },
    custom: {
      title: 'Custom Information',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Lorem ipsum dolor sit amet', value: 'Maecenas ullamcorper erat mi, vel consequat enim suscipit at.' },
              { label: 'Quisque in felis ut tellus', value: 'Pellentesque a elit at elit auctor tempus sed vitae mi' },
              { label: 'Morbi blandit auctor', value: 'Vestibulum sollicitudin tortor dui, quis aliquet sapien convallis sed.' },
              { label: 'Sed sit amet risus quis velit lacinia gravida.', value: 'Aenean interdum elementum arcu. Vivamus purus lorem, semper quis libero et.' },
              { label: 'Morbi dictum orci neque.', value: 'Curabitur vehicula tellus sit amet neque placerat, vel sagittis.' }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">{item.label}</h3>
                <p className="text-sm text-gray-600">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
  };

  return (
    <div className="max-w-4xl py-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative py-4 px-1 text-sm font-medium transition-colors duration-200
                ${activeTab === tab.id ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                  layoutId="activeTab"
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="prose max-w-none"
          >
            <h2 className="text-xl font-semibold mb-4">{tabContent[activeTab].title}</h2>
            {tabContent[activeTab].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
