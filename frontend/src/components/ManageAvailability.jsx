import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Clock, Plus, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { availabilityApi } from '../services/api';

const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function ManageAvailability() {
  const [availability, setAvailability] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const data = await availabilityApi.getLawyerAvailability(user.id);
          setAvailability(data);
        }
      } catch (err) {
        console.error('Error fetching availability:', err);
        toast.error('Failed to load schedule');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const handleAddSlot = (dayIndex) => {
    setAvailability([...availability, {
      day_of_week: dayIndex,
      start_time: '09:00:00',
      end_time: '17:00:00'
    }]);
  };

  const handleRemoveSlot = (index) => {
    const newAvailability = [...availability];
    newAvailability.splice(index, 1);
    setAvailability(newAvailability);
  };

  const handleTimeChange = (index, field, value) => {
    const newAvailability = [...availability];
    // Ensure format is HH:MM:SS
    const formattedValue = value.length === 5 ? `${value}:00` : value;
    newAvailability[index][field] = formattedValue;
    setAvailability(newAvailability);
  };

  const handleSave = async () => {
    try {
      await availabilityApi.setAvailability(availability);
      toast.success('Schedule updated successfully');
    } catch (err) {
      console.error('Error saving availability:', err);
      toast.error(err.message || 'Failed to save schedule');
    }
  };

  if (isLoading) return <div className="p-12 text-center text-[#64748b]">Loading your schedule...</div>;

  return (
    <div className="space-y-6">
      <Card className="bg-white border-[#1e293b]/10">
        <div className="p-6 border-b border-[#1e293b]/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-['Playfair_Display'] text-[#1e293b]">Manage Your Schedule</h2>
              <p className="text-[#64748b] text-sm mt-1">Set your weekly recurring office hours</p>
            </div>
            <Button onClick={handleSave} className="bg-[#a47731] hover:bg-[#8d6629] text-white">
              Save Schedule
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {DAYS.map((day, dayIndex) => {
            const daySlots = availability.filter(slot => slot.day_of_week === dayIndex);
            
            return (
              <div key={day} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]/5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#a47731]" />
                    <h3 className="font-medium text-[#1e293b]">{day}</h3>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleAddSlot(dayIndex)}
                    className="text-[#a47731] border-[#a47731]/20 hover:bg-[#a47731]/5"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Slot
                  </Button>
                </div>

                {daySlots.length === 0 ? (
                  <p className="text-sm text-[#64748b] italic">No office hours set for this day.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availability.map((slot, globalIndex) => {
                      if (slot.day_of_week !== dayIndex) return null;
                      
                      return (
                        <div key={globalIndex} className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-lg border border-[#1e293b]/5">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <Label className="text-[10px] uppercase text-[#64748b]">From</Label>
                              <Input 
                                type="time" 
                                value={slot.start_time.substring(0, 5)} 
                                onChange={(e) => handleTimeChange(globalIndex, 'start_time', e.target.value)}
                                className="h-8 text-xs border-[#1e293b]/10"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-[10px] uppercase text-[#64748b] pl-1">To</Label>
                              <Input 
                                type="time" 
                                value={slot.end_time.substring(0, 5)} 
                                onChange={(e) => handleTimeChange(globalIndex, 'end_time', e.target.value)}
                                className="h-8 text-xs border-[#1e293b]/10"
                              />
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveSlot(globalIndex)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
