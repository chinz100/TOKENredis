#กำหนด image เป็น Linux ที่ทำงานอยู่บน Version Apline
FROM node:alpine
#เปลี่ยน dir ไว้ที่ usr app
WORKDIR /usr/app

#Entry Point

COPY ./package.json ./
#copy file [เริ่มต้น] => [สิ้นสุด] เอาไฟล์ทั้งหมดไป
RUN npm install
COPY ./ ./ 
#หลังจาก install แล้วก็จะทำการ เริ่มโปรแกรม
CMD ["npm","start"]
