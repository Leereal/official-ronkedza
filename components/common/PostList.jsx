import Image from "next/image";

const PostList = () => {
  return (
    <div>
      <table class="table table-report sm:mt-2">
        <thead>
          <tr>
            <th class="whitespace-nowrap">IMAGES</th>
            <th class="whitespace-nowrap">DATE POSTED</th>
            <th class="whitespace-nowrap">PRODUCT NAME</th>
            <th class="text-center whitespace-nowrap">STOCK</th>
            <th class="text-center whitespace-nowrap">STATUS</th>
            <th class="text-center whitespace-nowrap">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr class="intro-x">
            <td class="w-40">
              <div class="flex">
                <div class="w-10 h-10 image-fit zoom-in">
                  <Image
                    alt="Midone - HTML Admin Template"
                    class="tooltip rounded-full"
                    src="/dist/images/preview-10.jpg"
                    layout="fill"
                  />
                </div>
                <div class="w-10 h-10 image-fit zoom-in">
                  <Image
                    alt="Midone - HTML Admin Template"
                    class="tooltip rounded-full"
                    src="/dist/images/preview-10.jpg"
                    layout="fill"
                  />
                </div>
                <div class="w-10 h-10 image-fit zoom-in">
                  <Image
                    alt="Midone - HTML Admin Template"
                    class="tooltip rounded-full"
                    src="/dist/images/preview-10.jpg"
                    layout="fill"
                  />
                </div>
              </div>
            </td>
            <td class="text-center">12 May 2022 12:00PM</td>
            <td>
              <a href="" class="font-medium whitespace-nowrap">
                Nike Air Max 270
              </a>
              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                Sport &amp; Outdoor
              </div>
            </td>
            <td class="text-center">50</td>
            <td class="w-40">
              <div class="flex items-center justify-center text-success">
                {" "}
                <i
                  data-lucide="check-square"
                  class="w-4 h-4 mr-2"
                ></i> Active{" "}
              </div>
            </td>
            <td class="table-report__action w-56">
              <div class="flex justify-center items-center">
                <a class="flex items-center mr-3" href="">
                  {" "}
                  <i
                    data-lucide="check-square"
                    class="w-4 h-4 mr-1"
                  ></i> Edit{" "}
                </a>
                <a class="flex items-center text-danger" href="">
                  {" "}
                  <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> Delete{" "}
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PostList;
