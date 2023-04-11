package com.example.readingapp.ui;

import static android.content.Context.MODE_PRIVATE;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.example.readingapp.R;
import com.example.readingapp.api.ApiService;
import com.example.readingapp.function.SignIn;
import com.example.readingapp.function.UpdatePassword;
import com.example.readingapp.model.TaiKhoan;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class TaiKhoanFragment extends Fragment {
    private static final String MY_PREFERENCE_NAME = "USER_ID";
    private static final String MY_PREFERENCE_PASS = "USER_PASS";
    String id = null;
    String pass = null;
    private EditText tvHoVaTen1;
    private TextView tvEmail, tvEmail1, tvCSHoTen, tvCSMatKhau, tv_TaiKhoan;
    private Button btnXacNhanHoTen, btn_LogOut;
    private TaiKhoan user;
    private boolean isID = true;

    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view;
        view = inflater.inflate(R.layout.fragment_tai_khoan, container, false);
        init(view);
        SharedPreferences sharedPreferences = getContext().getSharedPreferences(MY_PREFERENCE_NAME, MODE_PRIVATE);
        id = sharedPreferences.getString("value", "");
        SharedPreferences shared = getContext().getSharedPreferences(MY_PREFERENCE_NAME, MODE_PRIVATE);
        pass = shared.getString("value", "");
        check(id);
        getThongTinTaiKhoan(id);
        tvCSHoTen.setOnClickListener(v -> {
            btnXacNhanHoTen.setVisibility(View.VISIBLE);
            tvHoVaTen1.setEnabled(true);
        });
        tvCSMatKhau.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), UpdatePassword.class);
            intent.putExtra("user", user);
            startActivity(intent);
        });
        btnXacNhanHoTen.setOnClickListener(v -> ChinhSuaHoTen(id));
        btn_LogOut.setOnClickListener(v -> {
            SharedPreferences sharedPref = this.getActivity().getSharedPreferences(MY_PREFERENCE_NAME, MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putString("value", "");
            editor.apply();
            Intent intent = new Intent(getActivity(), SignIn.class);
            startActivity(intent);
        });
//        lichsu.setOnClickListener(v -> {
//            Intent intent = new Intent(ThongTinTaiKhoan.this, LichSu.class);
//            startActivity(intent);
//            finish();
//        });
//        yeuthich.setOnClickListener(v -> {
//            Intent intent = new Intent(ThongTinTaiKhoan.this, Favorite.class);
//            startActivity(intent);
//            finish();
//        });
        return view;
    }

    private void ChinhSuaHoTen(String s) {
        String newHoTen = tvHoVaTen1.getText().toString();
        TaiKhoan taiKhoan = new TaiKhoan(false, true, newHoTen);
        ApiService.apiService.updateTaiKhoan(s, taiKhoan).enqueue(new Callback<TaiKhoan>() {
            @Override
            public void onResponse(@NonNull Call<TaiKhoan> call, @NonNull Response<TaiKhoan> response) {
            }

            @Override
            public void onFailure(@NonNull Call<TaiKhoan> call, @NonNull Throwable t) {
                Log.e("lỗi ", "" + t);
            }
        });
        btnXacNhanHoTen.setVisibility(View.INVISIBLE);
        tvHoVaTen1.setEnabled(false);
    }

    private void getThongTinTaiKhoan(String s) {
        ApiService.apiService.thongtintaikhoan(s).enqueue(new Callback<TaiKhoan>() {
            @Override
            public void onResponse(@NonNull Call<TaiKhoan> call, @NonNull Response<TaiKhoan> response) {
                TaiKhoan taiKhoan = response.body();
                if (taiKhoan != null && taiKhoan.isTrangThai()) {
                    user = taiKhoan;
                    tv_TaiKhoan.setText(taiKhoan.getTaiKhoan());
                    tvHoVaTen1.setText(taiKhoan.getHoTen());
                    tvEmail.setText(taiKhoan.getEmail());
                    tvEmail1.setText(taiKhoan.getEmail());
                    tvEmail1.setText(taiKhoan.getEmail());
                }
            }

            @Override
            public void onFailure(@NonNull Call<TaiKhoan> call, @NonNull Throwable t) {
                Log.e("Thông tin tài khoản: ", t.toString());
            }
        });
    }

    public void init(View view) {
        tv_TaiKhoan = view.findViewById(R.id.ttcn_tv_TaiKhoan);
        tvHoVaTen1 = view.findViewById(R.id.ttcn_tv_HoVaTen1);
        tvEmail = view.findViewById(R.id.ttcn_tv_Email);
        tvEmail1 = view.findViewById(R.id.ttcn_tv_Email1);
        tvCSHoTen = view.findViewById(R.id.ttcn_tv_ChinhSuaHoTen);
        tvCSMatKhau = view.findViewById(R.id.ttcn_tv_ChinhSuaMK);
        btnXacNhanHoTen = view.findViewById(R.id.ttcn_btn_XacnhanHovaTen);
        btn_LogOut = view.findViewById(R.id.btn_LogOut);
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

    private void Dialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        builder.setMessage("Tài khoản chưa đăng nhập")
                .setIcon(R.drawable.ic_notifications_red)
                .setTitle("Thông báo");
        builder.setPositiveButton("OK", (dialog, which) -> {
            Intent intent = new Intent(((Dialog) dialog).getContext(), SignIn.class);
            startActivity(intent);
        });
        AlertDialog dialog = builder.create();
        dialog.show();
        // Set button text color
        Button okButton = dialog.getButton(DialogInterface.BUTTON_POSITIVE);
        okButton.setTextColor(Color.BLACK);
    }

    private void Dialog3() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
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
}