/*
   public int getContentid();
   public String getTitle();
   public String getAddress();
   public String getImage1();
   public int getHit();
   public int getContenttype();
   public int getRownum();
 */
export interface MainItem {
    contentid:number;
    title:string;
    address:string;
    image1:string;
    hit:number;
    contenttype:number;
}
export interface TravelItem {
    contentid:number;
    title:string;
    address:string;
    image1:string;
    hit:number;
    contenttype:number;
}
export interface MainData{
    main:MainItem;
    sList:TravelItem[];
    bList:TravelItem[];
    jList:TravelItem[];
}
