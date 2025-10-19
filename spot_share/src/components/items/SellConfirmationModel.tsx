import { useState } from "react";
import { toast } from "sonner";
import Modal from "./Modal";
import SwipeToConfirm from "@/components/ui/swiper";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};
export const SellConfirmationModal: React.FC<ModalProps> = ({
  open,
  onClose,
}: ModalProps) => {
  const [formData, setFormData] = useState({
    time: "",
    carMake: "",
    carModel: "",
    carLicense: "",
  });

  const isFormValid = formData.time && formData.carMake && formData.carModel;

  const handleConfirm = () => {
    if (!isFormValid) {
      toast.error("Please fill in all fields before confirming");
      return;
    }

    toast.success("Spot listing confirmed!", {
      description: `${formData.carMake} ${formData.carModel} - Available at ${formData.time}`,
    });

    setFormData({ time: "", carMake: "", carModel: "", carLicense: "" });
    onClose();
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="List Your Parking Spot"
      className=""
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-black">Sell Your Spot</h3>
          <p className="text-muted-foreground">
            Fill in the details below to list your parking spot and start
            earning.
          </p>
        </div>

        <div className="space-y-6 bg-card border border-border rounded-xl p-6">
          <div className="space-y-2">
            <label htmlFor="time" className="text-md font-medium mr-5">
              Available Time
            </label>
            <input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("time", e.target.value)
              }
              className="h-12 text-base"
              placeholder="Select time"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="carMake" className="text-md font-medium mr-5">
                Car Make
              </label>
              <input
                id="carMake"
                type="text"
                value={formData.carMake}
                onChange={(e) => handleInputChange("carMake", e.target.value)}
                className="h-12 text-base"
                placeholder="e.g., Toyota"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="carModel" className="text-md font-medium mr-5">
                Car Model
              </label>
              <input
                id="carModel"
                type="text"
                value={formData.carModel}
                onChange={(e) => handleInputChange("carModel", e.target.value)}
                className="h-12 text-base"
                placeholder="e.g., Camry"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="carModel" className="text-md font-medium mr-5">
                License Plate
              </label>
              <input
                id="carLicense"
                type="text"
                value={formData.carLicense}
                onChange={(e) =>
                  handleInputChange("carLicense", e.target.value)
                }
                className="h-12 text-base"
                placeholder="ABC123"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-lg">Listing Summary</h4>
            <div className="space-y-1 text-lg text-muted-foreground">
              <p>
                <span className="font-medium">Time:</span>{" "}
                {formData.time || "Not set"}
              </p>
              <p>
                <span className="font-medium">Vehicle:</span>{" "}
                {formData.carMake && formData.carModel
                  ? `${formData.carMake} ${formData.carModel}`
                  : "Not specified"}
              </p>
              <p>
                <span className="font-medium">Plate #:</span>{" "}
                {formData.carLicense
                  ? `${formData.carLicense}`
                  : "Not specified"}
              </p>
            </div>
          </div>

          <SwipeToConfirm
            onConfirm={handleConfirm}
            text="Swipe to list spot"
            disabled={!isFormValid}
          />

          {!isFormValid && (
            <p className="text-xs text-muted-foreground text-center">
              Complete all fields to enable confirmation
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
