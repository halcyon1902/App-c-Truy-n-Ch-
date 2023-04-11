package com.example.readingapp.function;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.readingapp.R;
import com.example.readingapp.adapter.ChapterAdapter;
import com.example.readingapp.adapter.TheLoaiAdapter;
import com.example.readingapp.api.ApiService;
import com.example.readingapp.model.Chapter;
import com.example.readingapp.model.TacGia;
import com.example.readingapp.model.TaiKhoan;
import com.example.readingapp.model.TheLoai;
import com.example.readingapp.model.Truyen;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class GetTruyen extends AppCompatActivity {
    private static final String MY_PREFERENCE_NAME = "USER_ID";
    private final Context context = this;
    String id = null;
    private TextView tvTenTruyen, tvTinhTrang, tv_luotxem, tvNoiDung, tvTongChuong, txt_tac_gia;
    private ImageView imgAnhBia, imgAnhNen, fav;
    private RecyclerView rcvTheLoai, rcvChapter;
    private List<String> listIDTheLoai;
    private List<TheLoai> listTheLoai;
    private List YeuThich;
    private List LichSu;
    private ChapterAdapter chapterAdapter;
    private boolean isfav = true;
    private boolean isID = true;
    List<Chapter> mlistChapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setFullScreen();
        setContentView(R.layout.activity_get_truyen);
        SharedPreferences sharedPreferences = getSharedPreferences(MY_PREFERENCE_NAME, MODE_PRIVATE);
        id = sharedPreferences.getString("value", "");
        // lấy intent
        Intent intent = getIntent();
        Truyen truyen = (Truyen) intent.getSerializableExtra("clickTruyen");
        init();
        listIDTheLoai = new ArrayList<>();
        listTheLoai = new ArrayList<>();
        initLinearLayout();
        hienThiTruyen(truyen);
        isFavorite(truyen);
        fav.setOnClickListener(v -> {
            check(id);
            if (isID) {
                if (isfav) {
                    xoaYeuThich(truyen);
                } else {
                    themYeuThich(truyen);
                }
            }
        });
    }

    private void check(String id) {
        if (id.equals("")) {
            Dialog();
            isID = false;
        } else {
            ApiService.apiService.thongtintaikhoan(id).enqueue(new Callback<TaiKhoan>() {
                @Override
                public void onResponse(@NonNull Call<TaiKhoan> call, @NonNull Response<TaiKhoan> response) {
                    TaiKhoan taiKhoan = response.body();
                    if (taiKhoan != null) {
                        if (!taiKhoan.isTrangThai()) {
                            Dialog3();
                            isID = false;
                        } else {
                            isID = true;
                            YeuThich = taiKhoan.getYeuThich();
                        }
                    }
                }

                @Override
                public void onFailure(@NonNull Call<TaiKhoan> call, @NonNull Throwable t) {
                    Log.e("Thông tin tài khoản: ", t.toString());
                }
            });
        }
    }

    private void isFavorite(Truyen truyen) {
        ApiService.apiService.thongtintaikhoan(id).enqueue(new Callback<TaiKhoan>() {
            @Override
            public void onResponse(@NonNull Call<TaiKhoan> call, @NonNull Response<TaiKhoan> response) {
                TaiKhoan taiKhoan = response.body();
                if (taiKhoan != null) {
                    List<String> yeuThich = taiKhoan.getYeuThich();
                    if (yeuThich != null && yeuThich.contains(truyen.get_id())) {
                        fav.setImageResource(R.drawable.ic_favorite_red);
                        fav.setBackgroundResource(R.drawable.ic_favorite_red);
                        isfav = true;
                    } else {
                        fav.setImageResource(R.drawable.ic_favorite_black);
                        fav.setBackgroundResource(R.drawable.ic_favorite_black);
                        isfav = false;
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<TaiKhoan> call, @NonNull Throwable t) {
                // Handle failure
            }
        });
    }


    private void initLinearLayout() {
        GridLayoutManager gridLayoutManager = new GridLayoutManager(this, 3);
        LinearLayoutManager linearLayoutManager2 = new LinearLayoutManager(this);
        rcvTheLoai.setLayoutManager(gridLayoutManager);
        rcvChapter.setLayoutManager(linearLayoutManager2);
    }

    @SuppressLint("SetTextI18n")
    private void hienThiTruyen(Truyen truyen) {
        if (truyen != null && truyen.isTrangThai()) {
            listIDTheLoai = Arrays.asList(truyen.getTheLoais());
            mlistChapter = Arrays.asList(truyen.getChapters());
            //Hiển thị thể loại
            for (int i = 0; i < listIDTheLoai.size(); i++) {
                ApiService.apiService.GetTheLoai(listIDTheLoai.get(i)).enqueue(new Callback<TheLoai>() {
                    @Override
                    public void onResponse(@NonNull Call<TheLoai> call, @NonNull Response<TheLoai> response) {
                        TheLoai theLoai = response.body();
                        if (theLoai != null) {
                            listTheLoai.add(theLoai);
                        }
                        TheLoaiAdapter theLoaiAdapter = new TheLoaiAdapter(listTheLoai, GetTruyen.this);
                        rcvTheLoai.setAdapter(theLoaiAdapter);
                    }

                    @Override
                    public void onFailure(@NonNull Call<TheLoai> call, @NonNull Throwable t) {

                    }
                });
            }
            //Hiển thị tác giả
            ApiService.apiService.GetTacGia(truyen.getTacGia()).enqueue(new Callback<TacGia>() {
                @Override
                public void onResponse(@NonNull Call<TacGia> call, @NonNull Response<TacGia> response) {
                    TacGia tacGia = response.body();
                    if (tacGia != null) {
                        // Hiển thị tên tác giả lên giao diện
                        txt_tac_gia.setText("Tác giả: " + tacGia.getTenTacGia());
                    }
                }

                @Override
                public void onFailure(@NonNull Call<TacGia> call, @NonNull Throwable t) {
                    // Xử lý khi gặp lỗi
                }
            });
            //Hiển thị chapter
            Collections.reverse(mlistChapter);
            chapterAdapter = new ChapterAdapter(mlistChapter, context);
            rcvChapter.setAdapter(chapterAdapter);
            //hiển thị thông tin truyện
            tvTenTruyen.setText(truyen.getTenTruyen());
            if (truyen.isTrangThai()) {
                tvTinhTrang.setText("Tình trạng: Hoàn thành");
            } else {
                tvTinhTrang.setText("Tình trạng: Đang tiến thành");
            }
            tvNoiDung.setText(truyen.getGioiThieu());
            tvTongChuong.setText("Tổng chapter: " + mlistChapter.size());
            Picasso.get().load(truyen.getAnhBia()).into(imgAnhBia);
            Picasso.get().load(truyen.getAnhBia()).into(imgAnhNen);
            GetLuotXemAllChapter(truyen);
        }
    }

    private void GetLuotXemAllChapter(Truyen truyen) {
        ApiService.apiService.GetTruyen(truyen.get_id()).enqueue(new Callback<Truyen>() {
            @Override
            public void onResponse(Call<Truyen> call, Response<Truyen> response) {
                Truyen truyen1 = response.body();
                List<Chapter> listChapter = Arrays.asList(truyen1.getChapters());
                int sum = 0;
                for (int i = 0; i < listChapter.size(); i++) {
                    sum = sum + listChapter.get(i).getLuotXem();
                }
                String luotxem = String.valueOf(sum);
                tv_luotxem.setText(luotxem);
            }

            @Override
            public void onFailure(Call<Truyen> call, Throwable t) {

            }
        });
    }

    private void themYeuThich(@NonNull Truyen truyen) {
        ApiService.apiService.thongtintaikhoan(id).enqueue(new Callback<TaiKhoan>() {
            @Override
            public void onResponse(Call<TaiKhoan> call, Response<TaiKhoan> response) {
                TaiKhoan taiKhoan = response.body();
                if (taiKhoan != null) {
                    List<String> YeuThich = taiKhoan.getYeuThich();
                    if (YeuThich == null) {
                        YeuThich = new ArrayList<>();
                    }
                    if (!YeuThich.contains(truyen.get_id())) {
                        YeuThich.add(truyen.get_id());
                        taiKhoan.setYeuThich(YeuThich);
                        ApiService.apiService.updateTaiKhoan(id, taiKhoan).enqueue(new Callback<TaiKhoan>() {
                            @Override
                            public void onResponse(Call<TaiKhoan> call, Response<TaiKhoan> response) {

                            }

                            @Override
                            public void onFailure(Call<TaiKhoan> call, Throwable t) {

                            }
                        });
                        fav.setImageResource(R.drawable.ic_favorite_red);
                        fav.setBackgroundResource(R.drawable.ic_favorite_red);
                        isfav = true;
                    }
                }
            }

            @Override
            public void onFailure(Call<TaiKhoan> call, Throwable t) {

            }
        });
    }

    private void xoaYeuThich(@NonNull Truyen truyen) {
        ApiService.apiService.thongtintaikhoan(id).enqueue(new Callback<TaiKhoan>() {
            @Override
            public void onResponse(Call<TaiKhoan> call, Response<TaiKhoan> response) {
                TaiKhoan taiKhoan = response.body();
                if (taiKhoan != null) {
                    List<String> YeuThich = taiKhoan.getYeuThich();
                    if (YeuThich == null) {
                        YeuThich = new ArrayList<>();
                    }
                    if (YeuThich.contains(truyen.get_id())) {
                        YeuThich.remove(truyen.get_id());
                        taiKhoan.setYeuThich(YeuThich);
                        ApiService.apiService.updateTaiKhoan(id, taiKhoan).enqueue(new Callback<TaiKhoan>() {
                            @Override
                            public void onResponse(Call<TaiKhoan> call, Response<TaiKhoan> response) {

                            }

                            @Override
                            public void onFailure(Call<TaiKhoan> call, Throwable t) {

                            }
                        });
                        fav.setImageResource(R.drawable.ic_favorite_black);
                        fav.setBackgroundResource(R.drawable.ic_favorite_black);
                        isfav = false;
                    }
                }
            }

            @Override
            public void onFailure(Call<TaiKhoan> call, Throwable t) {

            }
        });
    }


    private void setFullScreen() {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }

    private void init() {
        tvTenTruyen = findViewById(R.id.tv_ten_truyen);
        fav = findViewById(R.id.btn_fav);
        tvTinhTrang = findViewById(R.id.tv_tinhtrang_truyen);
        tv_luotxem = findViewById(R.id.tv_luotxem);
        tvNoiDung = findViewById(R.id.tv_noi_dung_truyen);
        tvTongChuong = findViewById(R.id.tv_tong_chapter);
        imgAnhBia = findViewById(R.id.manga_cover);
        imgAnhNen = findViewById(R.id.backdrop);
        rcvTheLoai = findViewById(R.id.rcv_The_Loai);
        txt_tac_gia = findViewById(R.id.txt_tac_gia);
        rcvChapter = findViewById(R.id.rcv_chapter);
    }

    private void Dialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Tài khoản chưa đăng nhập")
                .setIcon(R.drawable.ic_notifications_red)
                .setTitle("Thông báo");
        builder.setPositiveButton("OK", (dialog, which) -> {
            Intent intent = new Intent(((Dialog) dialog).getContext(), SignIn.class);
            startActivity(intent);
            finish();
        });
        AlertDialog dialog = builder.create();
        dialog.show();
        // Set button text color
        Button okButton = dialog.getButton(DialogInterface.BUTTON_POSITIVE);
        okButton.setTextColor(Color.BLACK);
    }

    private void Dialog3() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Tài khoản đã bị đóng băng! Xin liên hệ quản trị viên ")
                .setIcon(R.drawable.ic_notifications_red)
                .setTitle("Thông báo");
        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss(); // Close the dialog
            }
        });
        AlertDialog dialog = builder.create();
        dialog.show();
        // Set button text color
        Button okButton = dialog.getButton(DialogInterface.BUTTON_POSITIVE);
        okButton.setTextColor(Color.BLACK);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        Intent intent = getIntent();
        Truyen truyen = (Truyen) intent.getSerializableExtra("clickTruyen");
        GetLuotXemAllChapter(truyen);
    }
}