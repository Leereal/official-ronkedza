"use client";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FaPlus, FaTrash } from "react-icons/fa6";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { useState } from "react";
import { Button } from "../ui/button";
import moment from "moment";

const SchedulePicker = ({ allPostSchedules, setAllPostSchedules }) => {
  const [postSchedule, setPostSchedule] = useState({
    startDateTime: null,
    endDateTime: null,
    recurrence: "",
  });

  const removeSchedule = (idx) => {
    const newPostSchedules = allPostSchedules.filter(
      (x, index) => index !== idx
    );
    setAllPostSchedules(newPostSchedules);
  };
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex gap-2">
          <FaPlus size={20} className="text-gray-400" />{" "}
          <span>Add New Schedules</span>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-slate-600 ">
        <div>
          <p>Recurrence</p>
          <Select
            onValueChange={(value) =>
              setPostSchedule((prevState) => ({
                ...prevState,
                recurrence: value,
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Recurrence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once">Once</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3 items-center">
          <div>
            <Label>
              {postSchedule.recurrence !== "once" &&
              postSchedule.recurrence !== ""
                ? "Start"
                : ""}{" "}
              Date and Time
            </Label>
            <div className="flex-center h-[40px] w-full overflow-hidden rounded-full bg-grey-50 px-3 py-2">
              <FaCalendarAlt className="text-grey-500 text-[0.750rem] sm:text-base" />
              <DatePicker
                minDate={new Date()}
                maxDate={moment().add(1, "years").toDate()}
                selected={postSchedule.startDateTime}
                onChange={(date) => {
                  setPostSchedule((prevState) => ({
                    ...prevState,
                    startDateTime: date,
                  }));
                }}
                showTimeSelect
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                wrapperClassName="datePicker"
              />
            </div>
          </div>
          {postSchedule.recurrence !== "once" &&
            postSchedule.recurrence !== "" && (
              <div>
                <Label>End Date and Time</Label>
                <div className="flex-center h-[40px] w-full overflow-hidden rounded-full bg-grey-50 px-3 py-2">
                  <FaCalendarAlt className="text-grey-500 text-[0.750rem] sm:text-base " />
                  <DatePicker
                    minDate={
                      postSchedule.startDateTime
                        ? postSchedule.startDateTime
                        : new Date()
                    }
                    maxDate={moment().add(1, "years").toDate()}
                    selected={postSchedule.endDateTime}
                    onChange={(date) => {
                      setPostSchedule((prevState) => ({
                        ...prevState,
                        endDateTime: date,
                      }));
                    }}
                    showTimeSelect
                    timeInputLabel="Time:"
                    dateFormat="MM/dd/yyyy h:mm aa"
                    wrapperClassName="datePicker"
                  />
                </div>
              </div>
            )}
          <span
            className="text-[0.7rem] sm:text-[0.875rem] bg-green-500 p-1 rounded-2xl mt-4 cursor-pointer"
            onClick={() => {
              setAllPostSchedules([...allPostSchedules, postSchedule]);
            }}
          >
            Save
          </span>
        </div>
        <div>
          {allPostSchedules.map((schedule, index) => (
            <p className="text-[0.65rem] text-green-900 flex gap-2">
              <span className="capitalize font-bold">
                {schedule.recurrence === "once" || schedule.recurrence === ""
                  ? "once"
                  : schedule.recurrence}
              </span>
              :{" "}
              {moment(schedule.startDateTime).format("dddd, D MMMM YYYY h:mmA")}
              {schedule.endDateTime
                ? ` to ${moment(schedule.endDateTime).format(
                    "dddd, D MMMM YYYY h:mmA"
                  )}`
                : ""}{" "}
              <span>
                <FaTrash
                  className="text-red-500 cursor-pointer"
                  onClick={() => removeSchedule(index)}
                />
              </span>
            </p>
          ))}
        </div>
        <DialogClose asChild>
          <Button>Done</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulePicker;
