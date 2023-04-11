package com.example.readingapp.function;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.readingapp.R;
import com.example.readingapp.api.ApiService;
import com.example.readingapp.model.TaiKhoan;
import com.google.android.material.textfield.TextInputEditText;

import org.json.JSONException;
import org.json.JSONObject;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class QuenMatKhau extends AppCompatActivity {
    private TextInputEditText edtEmail;
    private Button btnQuayLai, btnSend;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setFullScreen();
        setContentView(R.layout.activity_quen_mat_khau);
        init();
        btnQuayLai.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(QuenMatKhau.this, SignIn.class));
            }
        });
        btnSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                clickSend();
            }
        });
    }

    private void clickSend() {
        String mail = edtEmail.getText().toString().trim();
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("mail", mail);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        String jsonString = jsonObject.toString();
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), jsonString);
        Log.e("ds", requestBody.toString());
        ApiService.apiService.QuenMatKhau(requestBody).enqueue(new Callback<TaiKhoan>() {
            @Override
            public void onResponse(@NonNull Call<TaiKhoan> call, @NonNull Response<TaiKhoan> response) {
            }

            @Override
            public void onFailure(@NonNull Call<TaiKhoan> call, @NonNull Throwable t) {

            }
        });
    }

    private void Dialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Gửi yêu cầu lấy lại tài khoản thành công!")
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

    private void init() {
        edtEmail = findViewById(R.id.edt_emailpass);
        btnQuayLai = findViewById(R.id.btn_back);
        btnSend = findViewById(R.id.btn_send);
    }

    private void setFullScreen() {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }
}